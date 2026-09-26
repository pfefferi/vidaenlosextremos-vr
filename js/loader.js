// loader.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let site = urlParams.get('site');

    if (!site) {
        const path = window.location.pathname;
        site = path.split("/").pop().split(".")[0];
    }

    const jsonKey = site.replace(/_/g, "-");
    console.log(`[Loader] Init: ${jsonKey}`);

    const debugConsole = document.getElementById('debug-console');

    loadIcons();
    checkVersion();
    if (ROV.controlsUI) ROV.controlsUI.init();
    if (ROV.modelTest) ROV.modelTest.init();

    fetch('data/dives.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (!data[jsonKey]) throw new Error(`Key "${jsonKey}" not found in JSON`);

            const diveData = data[jsonKey];

            // 1. Inyectar Configuración Global (Vital para Física y Resets)
            if (window.ROV && ROV.config) {
                // Profundidad base para que la física calcule bien (evita el 0m)
                ROV.config.baseDepth = diveData.depth || 0;

                // Coordenadas de Spawn
                ROV.config.startPosition = diveData.start_position || { x: 0, y: 2, z: 10 };
                ROV.config.startRotation = diveData.start_rotation || { x: 0, y: 0, z: 0 };
                ROV.config.floorColor = diveData.floor_color || '#4e5846';
                if (diveData.floor_limit !== undefined) {
                    ROV.config.floorLimitOverride = diveData.floor_limit;
                }
            }

            // 2. Aplicar Posición Inicial Inmediatamente
            const rig = document.getElementById('camera-rig');
            if (rig) {
                // Usamos los datos recién guardados o los del JSON
                const startPos = diveData.start_position || { x: 0, y: 2, z: 10 };
                const startRot = diveData.start_rotation || { x: 0, y: 0, z: 0 };

                rig.setAttribute('position', startPos);
                rig.setAttribute('rotation', startRot);
                console.log(`[Loader] Spawning at:`, startPos);
            }

            // 3. Actualizar UI y cargar modelo
            updateUI(diveData);
            // En model_test, ?model= puede redirigir al OBJ (sin efecto en otros sitios)
            const modelPath = (window.ROV && ROV.modelTest)
                ? ROV.modelTest.resolve(diveData.model_path)
                : diveData.model_path;
            const mtlPath = (window.ROV && ROV.modelTest)
                ? ROV.modelTest.currentMtlPath()
                : null;
            // Mark the test-site load in flight so an early pick queues
            // instead of racing it (A-Frame attaches last arrival wins).
            if (window.ROV && ROV.modelTest && ROV.modelTest.isActiveSite()) ROV.modelTest.loading = true;
            loadModelDirectly(modelPath, mtlPath);
        })
        .catch(err => {
            console.error("[Loader] Critical Error:", err);
            if (debugConsole) debugConsole.innerHTML = `ERROR: ${err.message}`;
            alert("Error cargando la misión. Revisa la consola.");
        });
});

function updateUI(data) {
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setText('ui-title', data.title);
    setText('ui-id', data.id);
    setText('ui-temp', data.temp);
    setText('ui-salinity', data.salinity);
    setText('ui-o2', data.o2_con);
    setText('date-block', data.date);
    document.title = `ROV: ${data.title}`;
}

function loadModelDirectly(url, mtlUrl) {
    const mapEntity = document.getElementById('map-entity');
    const debugConsole = document.getElementById('debug-console');

    if (!mapEntity) return;

    debugConsole.textContent = "SYSTEM: Loading 3D Model...";
    mapEntity.removeAttribute('gltf-model');
    mapEntity.removeAttribute('obj-model');

    mapEntity.addEventListener('model-loaded', () => {
        console.log("[Loader] Model loaded successfully!");
        debugConsole.textContent = "SYSTEM: Model Loaded. Dive Active.";
    }, { once: true });

    mapEntity.addEventListener('model-error', (e) => {
        console.error("[Loader] 3D Model Failed:", e.detail.src);
        debugConsole.textContent = "SYSTEM ERROR: Could not load 3D model.";
    }, { once: true });

    // model_test puede pedir OBJ (?model=obj): usa obj-model + mtl. Resto intacto.
    if (url.toLowerCase().endsWith('.obj')) {
        const mtl = mtlUrl || url.replace(/\.obj$/i, '.mtl');
        mapEntity.setAttribute('obj-model', `obj: url(${url}); mtl: url(${mtl})`);
    } else {
        mapEntity.setAttribute('gltf-model', url);
    }
}

function loadIcons() {
    fetch('assets/icons.html')
        .then(res => res.text())
        .then(html => {
            const div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = html;
            document.body.insertBefore(div, document.body.firstChild);
            console.log("[Loader] SVG Icons Injected");
        })
        .catch(err => console.error("[Loader] Icons Error:", err));
}

function checkVersion() {
    // Cache bust local version file
    fetch(`data/version.json?t=${Date.now()}`)
        .then(res => res.json())
        .then(ver => {
            console.log(
                `%c 🛠️ BUILD BASE HASH: ${ver.hash} \n%c 💬 "${ver.message}" \n%c 📅 Build Time: ${ver.timestamp}`,
                "color: #aaa; font-weight: bold; font-size: 11px;",
                "color: #888; font-style: italic;",
                "color: #888; font-size: 10px;"
            );

            const versionEl = document.getElementById('version-display');
            if (versionEl) versionEl.textContent = `VER. ${ver.hash}`;
        })
        .catch(() => console.warn("[Loader] Version tracking not found"));
}
