// rov-model-test.js
// Selector de modelos fotogramétricos para el hábitat de pruebas (site=model_test).
// Solo actúa en ese sitio; el resto de hábitats no se ven afectados.

ROV.modelTest = {
    siteKey: 'model-test',
    base: 'assets/models/model-test/',
    models: [
        { id: 'glb', file: 'odm_textured_model_geo.glb', label: 'S0883 Hero (skeleton) — GLB' },
        { id: 'obj', file: 'odm_textured_model_geo.obj', mtl: 'odm_textured_model_geo.mtl', label: 'S0883 Hero (skeleton) — OBJ' },
        { id: 'full-glb', base: 'assets/models/model-full/', file: 'odm_textured_model_geo.glb', label: 'S0883 Full track — GLB' },
        { id: 'full-obj', base: 'assets/models/model-full/', file: 'odm_textured_model_geo.obj', mtl: 'odm_textured_model_geo.mtl', label: 'S0883 Full track — OBJ' },
        { id: 'merged-glb', base: 'assets/models/model-merged/', file: 'odm_textured_model_geo.glb', label: 'S0883 Layers merged — GLB' },
        { id: 'merged-obj', base: 'assets/models/model-merged/', file: 'odm_textured_model_geo.obj', mtl: 'odm_textured_model_geo.mtl', label: 'S0883 Layers merged — OBJ' },
        { id: 'full-alt-glb', base: 'assets/models/model-full-alt/', file: 'odm_textured_model_geo.glb', label: 'S0883 Full-alt (experimental) — GLB' },
        { id: 'full-alt-obj', base: 'assets/models/model-full-alt/', file: 'odm_textured_model_geo.obj', mtl: 'odm_textured_model_geo.mtl', label: 'S0883 Full-alt (experimental) — OBJ' },
        { id: 'clean-glb', base: 'assets/models/model-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Clean (ghost cut, leveled) — GLB' },
        { id: 'clean-v2-glb', base: 'assets/models/model-clean-v2/', file: 'odm_textured_model_geo_v2.glb', label: 'S0883 Clean V2 (truth frame) — GLB' },
        { id: 'loose-glb', base: 'assets/models/model-loose/', file: 'odm_textured_model_geo.glb', label: 'S0883 Loose-100 (experimental) — GLB' },
        { id: 'noflip-glb', base: 'assets/models/model-noflip/', file: 'odm_textured_model_geo.glb', label: 'S0883 Noflip (experimental) — GLB' },
        { id: 'full-loose-clean-glb', base: 'assets/models/model-full-loose-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Full-loose clean — GLB (NEW)' },
        { id: 'noflip-clean-glb', base: 'assets/models/model-noflip-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Noflip clean — GLB (NEW)' },
        { id: 'layers-clean-glb', base: 'assets/models/model-layers-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Layers clean — GLB (NEW)' }
    ],
    current: 'glb',
    // Standing rules: (1) the newest model (last entry) is the default on load —
    // append new models at the end and they become the default automatically.
    // (2) the newest upload batch carries a ' (NEW)' suffix in switcher labels;
    // recompute every upload (older batches shed it). An explicit ?model= id
    // always wins over the default.
    defaultId: function () {
        return this.models[this.models.length - 1].id;
    },
    // Carpeta base del modelo activo; la usa rov-model-handler para centrar/escalar.
    activeBase: null,

    getSiteKey: function () {
        const urlParams = new URLSearchParams(window.location.search);
        let site = urlParams.get('site');
        if (!site) {
            const path = window.location.pathname;
            site = path.split("/").pop().split(".")[0];
        }
        return site.replace(/_/g, "-");
    },

    isActiveSite: function () {
        return this.getSiteKey() === this.siteKey;
    },

    find: function (id) {
        return this.models.find(m => m.id === id) || null;
    },

    dirFor: function (m) {
        return (m && m.base) || this.base;
    },

    pathFor: function (id) {
        const m = this.find(id);
        return m ? this.dirFor(m) + m.file : null;
    },

    /**
     * Hook para loader.js: en model_test, ?model=obj carga el OBJ directamente
     * (evita doble carga). En cualquier otro sitio devuelve la ruta intacta.
     */
    resolve: function (defaultPath) {
        if (!this.isActiveSite()) return defaultPath;
        const wanted = new URLSearchParams(window.location.search).get('model');
        const m = this.find(wanted) || this.find(this.defaultId());
        this.current = m.id;
        this.activeBase = this.dirFor(m);
        return this.dirFor(m) + m.file;
    },

    init: function () {
        if (!this.isActiveSite()) return;

        const row = document.getElementById('model-select-row');
        const select = document.getElementById('model-select');
        if (!row || !select) return;

        // Poblar dropdown (etiquetas fijas: son nombres de modelo, no texto UI)
        this.models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.label;
            select.appendChild(opt);
        });
        const wanted = new URLSearchParams(window.location.search).get('model');
        select.value = this.find(wanted) ? wanted : this.defaultId();
        row.style.display = 'block';
    },

    /**
     * Ruta .mtl del modelo activo (solo OBJ). Null si el activo es GLB o
     * si no estamos en model_test.
     */
    currentMtlPath: function () {
        if (!this.isActiveSite()) return null;
        const m = this.find(this.current);
        return (m && m.mtl) ? this.dirFor(m) + m.mtl : null;
    },

    /**
     * Cambio de modelo en caliente, sin recargar la página.
     * Limpia ambos componentes de modelo y monta el nuevo; el listener
     * 'model-loaded' de rov-main.js re-ejecuta setupModel (centrado/escala).
     */
    swap: function (id) {
        const m = this.find(id);
        const mapEntity = document.getElementById('map-entity');
        if (!m || !mapEntity) return;

        const debug = document.getElementById('debug-console');
        if (debug) debug.textContent = `SYSTEM: Loading model ${m.label}...`;

        mapEntity.removeAttribute('gltf-model');
        mapEntity.removeAttribute('obj-model');

        this.current = m.id;
        this.activeBase = this.dirFor(m);

        if (m.mtl) {
            mapEntity.setAttribute('obj-model', `obj: url(${this.dirFor(m) + m.file}); mtl: url(${this.dirFor(m) + m.mtl})`);
        } else {
            mapEntity.setAttribute('gltf-model', this.dirFor(m) + m.file);
        }

        // Feedback de error solo para este swap (el listener inicial es {once:true})
        mapEntity.addEventListener('model-error', () => {
            const dbg = document.getElementById('debug-console');
            if (dbg) dbg.textContent = `SYSTEM ERROR: Could not load ${m.label}.`;
        }, { once: true });

        const select = document.getElementById('model-select');
        if (select) select.value = m.id;

        // Deep link sin recarga
        const url = new URL(window.location.href);
        url.searchParams.set('model', m.id);
        window.history.replaceState(null, '', url.toString());

        console.log(`[ModelTest] Swapped to ${m.id}: ${this.dirFor(m) + m.file}`);
    }
};
