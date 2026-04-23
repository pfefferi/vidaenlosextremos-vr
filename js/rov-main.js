// rov-main.js
// Orquestador principal. Bucle de render y manejo de eventos globales.

AFRAME.registerComponent('rov-engine', {
    init: function () {
        this.frameCounter = 0;
        
        // 1. Evento de carga de modelo (Delegamos al Handler)
        const sceneEl = this.el;
        sceneEl.addEventListener('model-loaded', () => {
            const mesh = ROV.refs.mapEntity ? ROV.refs.mapEntity.getObject3D('mesh') : null;
            if (mesh && ROV.modelHandler) {
                ROV.modelHandler.setupModel(mesh);
            }

            // Feedback visual en consola debug
            if (ROV.refs.debug) {
                ROV.refs.debug.innerText = "SYSTEM: ROV Online - Dive Active";
                setTimeout(() => { ROV.refs.debug.style.opacity = "0"; }, 5000);
            }
        });

        // 2. Inicialización del Sistema
        this.initSystem();
    },

    initSystem: async function () {
        // Inicializar rotación táctil y ratón
        if (typeof initRotationControls === 'function') {
            initRotationControls();
            console.log("[Main] Rotation Controls Ready (Touch + Mouse)");
        }

        // Configurar cámara (Desactivar conflictos nativos)
        if (ROV.refs.cam) {
            ROV.refs.cam.setAttribute('look-controls', {
                touchEnabled: false,
                mouseEnabled: false,
                magicWindowTrackingEnabled: true
            });
        }

        // Inicializar Localización
        if (ROV.localization) {
            await ROV.localization.init();
        }

        // Inicializar Waypoints
        if (ROV.waypoints) {
            ROV.waypoints.init();
        }
    },

    tick: function (time, timeDelta) {
        if (!timeDelta) return; // Skip first frame if delta is 0

        const { cam, rig, headText, depthText, coordsBlock } = ROV.refs;
        const { activeAction } = ROV.state;

        // --- A. LÓGICA DE CONTROL (Prioridad Alta) ---

        // 1. Gamepad
        if (typeof updateGamepad === 'function') updateGamepad(timeDelta);

        // 2. Teclado
        if (ROV.updateKeyboard) ROV.updateKeyboard(timeDelta);

        // 3. Touch Virtual
        if (activeAction) {
            let fov = cam.components.camera.data.fov;
            let surge = 0, sway = 0, heave = 0;

            // Mapeo
            if (activeAction === 'move-up') surge = 1;
            if (activeAction === 'move-down') surge = -1;
            if (activeAction === 'move-left') sway = -1;
            if (activeAction === 'move-right') sway = 1;
            if (activeAction === 'ascend') heave = 1;
            if (activeAction === 'descend') heave = -1;

            // Aplicar movimiento
            if (surge !== 0 || sway !== 0 || heave !== 0) {
                ROV.physics.applyMove(surge, sway, heave, false, timeDelta);
            }

            // Zoom
            const zoomSpd = ROV.config ? ROV.config.baseZoomSpeed : 0.5;
            if (activeAction === 'zoom-in') fov = Math.max(5, fov - (zoomSpd * (fov / 80)));
            if (activeAction === 'zoom-out') fov = Math.min(150, fov + (zoomSpd * (fov / 80)));

            if (fov !== cam.components.camera.data.fov) {
                cam.setAttribute('camera', 'fov', fov);
            }
        }

        // --- B. LÓGICA DE UI Y SISTEMAS LENTOS (Prioridad Baja - Throttled) ---
        this.frameCounter++;
        if (this.frameCounter % 4 !== 0) return;

        // Actualizar Waypoints
        if (ROV.waypoints) {
            ROV.waypoints.update();
        }

        // Lecturas lentas
        const rot = cam.object3D.rotation;
        const rigRot = rig.object3D.rotation;
        const pos = rig.object3D.position;

        if (headText) {
            // THREE.Euler rotations are in radians, convert to degrees for HUD
            const rotYDeg = THREE.MathUtils.radToDeg(rot.y);
            const rigRotYDeg = THREE.MathUtils.radToDeg(rigRot.y);
            const h = Math.floor((360 - ((rotYDeg + rigRotYDeg) % 360)) % 360);
            headText.innerText = h.toString().padStart(3, '0');
        }

        if (depthText) {
            const bDepth = (ROV.config && ROV.config.baseDepth) ? ROV.config.baseDepth : 0;
            depthText.innerText = Math.floor(bDepth - pos.y);
        }

        if (coordsBlock) {
            coordsBlock.innerText =
                `X: ${pos.x.toFixed(2)}  Y: ${pos.y.toFixed(2)}  Z: ${pos.z.toFixed(2)}`;
        }
    }
});

// Evento Gamepad
window.addEventListener("gamepadconnected", (e) => {
    if (ROV.refs.debug) {
        const id = e.gamepad.id.split('(')[0];
        ROV.refs.debug.innerText = `GAMEPAD AT SLOT ${e.gamepad.index}: ${id}`;
        ROV.refs.debug.style.opacity = "1";
        console.log(`[Input] Gamepad detected at index ${e.gamepad.index}: ${e.gamepad.id}`);
        setTimeout(() => { if (!ROV.state.isLogbookOpen) ROV.refs.debug.style.opacity = "0"; }, 5000);
    }
});


