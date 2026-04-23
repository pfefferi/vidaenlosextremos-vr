// rov-physics.js
// Lógica de cálculo de movimiento y actualizaciones físicas

ROV.physics = {
    /**
     * Calcula y aplica el movimiento al RIG basado en inputs normalizados.
     * @param {number} surge - Movimiento adelante/atrás (-1 a 1)
     * @param {number} sway  - Movimiento lateral izquierda/derecha (-1 a 1)
     * @param {number} heave - Movimiento vertical arriba/abajo (-1 a 1)
     * @param {boolean} isTurbo - Si se aplica multiplicador extra (ej. stick analógico)
     */
    applyMove: function (surge, sway, heave, isTurbo = false, timeDelta = 16.6) {
        const refs = ROV.refs;
        const conf = ROV.config;
        const state = ROV.state;

        if (!refs.rig || !refs.cam) return;

        // Normalizamos el timeDelta a un factor (asumiendo 60fps = ~16.6ms)
        const timeScale = timeDelta / 16.6;

        // Datos actuales
        const rot = refs.cam.object3D.rotation; // Rotación cámara
        const rigRot = refs.rig.object3D.rotation;
        const currentPos = refs.rig.object3D.position;
        const fov = refs.cam.components.camera.data.fov;

        // 1. Calcular Velocidad actual
        // Añadimos el timeScale para hacer el movimiento independiente de los FPS
        const speedMult = conf.speedLevels[state.currentLevelIndex];
        const turboMult = isTurbo ? 1.5 : 1.0;
        const currentSpeed = conf.baseMoveSpeed * (fov / 80) * speedMult * turboMult * timeScale;

        // 2. Calcular Angulo Total (Rig + Cámara)
        const totalAngleY = rigRot.y + rot.y;

        // 3. Calcular desplazamientos
        // Surge (Adelante/Atrás)
        if (surge !== 0) {
            currentPos.x -= surge * Math.sin(totalAngleY) * currentSpeed;
            currentPos.z -= surge * Math.cos(totalAngleY) * currentSpeed;
        }

        // Sway (Strafe Lateral)
        if (sway !== 0) {
            currentPos.x += sway * Math.cos(totalAngleY) * currentSpeed;
            currentPos.z -= sway * Math.sin(totalAngleY) * currentSpeed;
        }

        // Heave (Vertical)
        if (heave !== 0) {
            // Ajuste leve: vertical suele ser un poco más lento (0.8)
            currentPos.y += heave * currentSpeed * 0.8;
        }

        // --- TERRAIN-FOLLOWING FLOOR BOUNDARY ---
        // Sample the heightmap at the ROV's current XZ position for terrain collision.
        // Falls back to flat floorLimit if heightmap not yet generated.
        let floorLimit;
        const hm = ROV.config.heightmap;

        if (hm && hm.data) {
            // Map ROV world XZ to heightmap grid cell
            const u = (currentPos.x - hm.bounds.minX) / (hm.bounds.maxX - hm.bounds.minX);
            const v = (currentPos.z - hm.bounds.minZ) / (hm.bounds.maxZ - hm.bounds.minZ);

            if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
                const cx = Math.min(Math.floor(u * (hm.resolution - 1)), hm.resolution - 1);
                const cz = Math.min(Math.floor(v * (hm.resolution - 1)), hm.resolution - 1);
                floorLimit = hm.data[cz * hm.resolution + cx];
            } else {
                // Outside model bounds — use global minimum
                floorLimit = hm.minY + 0.15;
            }
        } else if (ROV.config.floorLimitOverride !== undefined) {
            floorLimit = ROV.config.floorLimitOverride;
        } else if (ROV.config.floorLimit !== undefined) {
            floorLimit = ROV.config.floorLimit;
        } else if (ROV.config.startPosition) {
            floorLimit = ROV.config.startPosition.y - 0.05;
        } else {
            floorLimit = 0;
        }

        if (currentPos.y < floorLimit) {
            currentPos.y = floorLimit;
        }

        // 4. Update the actual Three.js object instead of calling setAttribute
        // Note: we don't need to reassign currentPos because we modified the object3D.position directly.
    },

    // Helper para UI de velocidad
    updateSpeedUI: function () {
        if (ROV.refs.speedValText) {
            ROV.refs.speedValText.innerText = ROV.config.speedLevels[ROV.state.currentLevelIndex].toFixed(1);
        }
    }
};
