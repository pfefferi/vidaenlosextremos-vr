// rov-model-handler.js
// Se encarga exclusivamente de cargar modelos, aplicar texturas manuales y ajustar escalas.

ROV.modelHandler = {
    /**
     * Se ejecuta cuando el modelo .glb/.gltf termina de cargar.
     * Busca texturas 'materialX_diffuse' y las aplica, luego centra y escala.
     */
    setupModel: function (mesh) {
        if (!mesh) return;

        const mapEntity = ROV.refs.mapEntity;
        // En model_test el loader puede montar OBJ (sin atributo gltf-model);
        // modelTest.activeBase indica la carpeta en ese caso. Resto intacto.
        let basePath = (ROV.modelTest && ROV.modelTest.activeBase) || null;
        if (!basePath) {
            const currentSrc = mapEntity.getAttribute('gltf-model');
            basePath = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
        }

        console.log(`[ModelHandler] Path base detectado: ${basePath}`);

        // 1. Carga Manual de Texturas (Fix para modelos sin texturas embebidas)
        const loader = new THREE.TextureLoader();

        mesh.traverse(node => {
            if (node.isMesh) {
                // Asegurar doble cara para ver paredes desde adentro si hace falta
                const materials = Array.isArray(node.material) ? node.material : [node.material];

                materials.forEach(mat => {
                    mat.side = THREE.DoubleSide;

                    // Transparency support (alpha handled by silhouette mask shader)
                    mat.transparent = true;
                    mat.depthWrite = true;
                    mat.opacity = 1.0; // Override any GLTF-baked opacity

                    // Si el modelo ya trae textura (GLB/OBJ con mapas), no sobreescribir.
                    // Los hábitats existentes llegan sin mapa: comportamiento intacto.
                    if (mat.map) return;

                    // Buscar patrón "materialXX" en el nombre del nodo
                    const match = node.name.match(/material(\d+)/i);
                    if (match) {
                        const textureUrl = `${basePath}textures/material${match[1]}_diffuse.jpeg`;

                        // Cargar textura asíncronamente
                        loader.load(textureUrl, (tex) => {
                            tex.encoding = THREE.sRGBEncoding;
                            tex.flipY = false; // Importante para GLTF
                            mat.map = tex;
                            mat.needsUpdate = true;
                        }, undefined, (err) => {
                            // Silencioso o warning suave para no saturar consola
                            console.warn(`[ModelHandler] Textura no encontrada: ${textureUrl}`);
                        });
                    }
                });
            }
        });

        // 2. Auto-Escalado y Centrado
        // En model_test los modelos ODM traen fragmentos outliers que revientan
        // el bbox global: se encaja al primitivo con más vértices. Resto intacto.
        const robustFit = ROV.modelTest && ROV.modelTest.isActiveSite();
        // NOTA model_test: el encuadre se mide dos veces. La primera (escala 1)
        // da el factor de escala; tras aplicarla se re-encuadra en coords. mundo
        // reales para centro/posición/máscara (si no, la máscara usa bounds sin
        // escalar y el modelo se vuelve invisible). Resto de hábitats: intacto.
        let fitBox = robustFit
            ? (function () {
                // Reset previo: en un swap el entity aún trae la escala del modelo
                // anterior; sin esto el re-encuadre mediría mundo ya escalado y el
                // factor saldría ~1.0 (modelo gigante). Solo model_test.
                mapEntity.setAttribute('scale', '1 1 1');
                mapEntity.object3D.updateMatrixWorld(true, true);
                return ROV.modelHandler.densityFitBox(mesh);
            })()
            : new THREE.Box3().setFromObject(mesh);
        // Calculamos la caja de rebote (Bounding Box). NOTA: usar fitBox
        // (re-encuadrado), no una referencia anterior al re-encuadre.
        const size = new THREE.Vector3();
        fitBox.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 20; // Tamaño objetivo en metros aprox
        const scaleFactor = targetSize / maxDim;

        // Aplicar escala
        mapEntity.setAttribute('scale', `${scaleFactor} ${scaleFactor} ${scaleFactor}`);
        if (robustFit) {
            mapEntity.object3D.updateMatrixWorld(true, true);
            fitBox = ROV.modelHandler.densityFitBox(mesh);
            fitBox.getSize(size);
        }

        // Calcular centro para posicionarlo en 0,0,0
        const center = new THREE.Vector3();
        fitBox.getCenter(center);

        // Ajuste de posición (El -2 en Y y -10 en Z son offsets estéticos para que quede frente a cámara)
        // NOTA model_test: center ya está en coords. mundo, sin re-escalar.
        const finalPosY = robustFit ? (-center.y) - 2 : (-center.y * scaleFactor) - 2;
        mapEntity.setAttribute('position', robustFit ? {
            x: -center.x,
            y: finalPosY,
            z: (-center.z) - 10
        } : {
            x: -center.x * scaleFactor,
            y: finalPosY,
            z: (-center.z * scaleFactor) - 10
        });

        // 3. Capas de Continuidad Visual (Advanced Shader Injection)
        // NOTA: en model_test size ya viene en coords. mundo (re-encuadre),
        // no se vuelve a multiplicar por scaleFactor.
        const floorY = robustFit
            ? finalPosY - (size.y / 2)
            : finalPosY - (size.y * scaleFactor / 2);

        // Store computed floor limit for physics (derived from geometry bottom)
        ROV.config.floorLimit = floorY;

        // A. Suelo Infinito
        const extendedFloor = document.getElementById('extended-floor');
        if (extendedFloor) {
            const floorColor = (ROV.config && ROV.config.floorColor) || '#4e5846';
            extendedFloor.setAttribute('material', 'color', floorColor);
            extendedFloor.setAttribute('position', { x: 0, y: floorY, z: 0 });
            extendedFloor.setAttribute('visible', 'true');
            extendedFloor.setAttribute('animation', 'property: material.opacity; from: 0; to: 1; dur: 2000');
        }

        // Force world matrix propagation so blender sees correct transformed coordinates
        mapEntity.object3D.updateMatrixWorld(true);

        // B. Auto-Generated Silhouette Mask (Edge Fade from actual geometry)
        // NOTA model_test: se omite el blender (máscara + heightmap). Es un sistema
        // estético ajustado a los hábitats curados; en mallas fotogramétricas con
        // outliers la máscara sale casi negra y vuelve invisible el modelo. Se usa
        // suelo plano (floorLimitOverride) en su lugar. Resto intacto.
        if (!robustFit && typeof ROV.blender !== 'undefined') {
            const maskData = ROV.blender.generateSilhouetteMask(mesh);
            ROV.blender.applyMaskFade(mesh, maskData);

            // C. Terrain Heightmap (terrain-following floor collision)
            ROV.config.heightmap = ROV.blender.generateHeightmap(mesh);
        }

        if (robustFit) {
            // El heightmap global heredaría los outliers: suelo plano al pie del modelo.
            delete ROV.config.heightmap;
            ROV.config.floorLimitOverride = floorY;
        }



        // Fog disabled during edge-fade tuning
        // const scene = document.querySelector('a-scene');
        // if (scene) {
        //     const fogFar = Math.max(30, targetSize * 1.5);
        //     const fogNear = fogFar * 0.1;
        //     scene.setAttribute('fog', { far: fogFar, near: fogNear });
        // }

        // 4. Ajuste dinámico de velocidad base según el tamaño del modelo
        // Modelos grandes necesitan moverse más rápido (x10 forward-speed boost)
        ROV.config.baseMoveSpeed = 10 * (0.02 + (Math.log10(maxDim + 1) * 0.03));

        console.log(`[ModelHandler] Modelo listo. Escala: ${scaleFactor.toFixed(4)}. Fog Far: ${Math.max(30, targetSize * 1.5)}`);
    },

    /**
     * Encuadre robusto por percentiles (coords. mundo): ignora los vértices
     * outliers de mallas fotogramétricas. Solo se usa en model_test.
     */
    densityFitBox: function (mesh, lo = 0.02, hi = 0.98) {
        mesh.updateWorldMatrix(true, true);
        const xs = [], ys = [], zs = [];
        const tmp = new THREE.Vector3();
        mesh.traverse(node => {
            if (!node.isMesh || !node.geometry || !node.geometry.attributes.position) return;
            node.updateWorldMatrix(true, false);
            const p = node.geometry.attributes.position;
            const step = Math.max(1, Math.floor(p.count / 20000));
            for (let i = 0; i < p.count; i += step) {
                tmp.set(p.getX(i), p.getY(i), p.getZ(i));
                tmp.applyMatrix4(node.matrixWorld);
                xs.push(tmp.x); ys.push(tmp.y); zs.push(tmp.z);
            }
        });
        if (!xs.length) return new THREE.Box3().setFromObject(mesh);
        const q = (arr, f) => {
            arr.sort((a, b) => a - b);
            return arr[Math.min(arr.length - 1, Math.floor(f * arr.length))];
        };
        return new THREE.Box3(
            new THREE.Vector3(q(xs, lo), q(ys, lo), q(zs, lo)),
            new THREE.Vector3(q(xs, hi), q(ys, hi), q(zs, hi))
        );
    }
};
