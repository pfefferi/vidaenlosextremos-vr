// rov-model-test.js
// Selector de modelos fotogramétricos para el hábitat de pruebas (site=model_test).
// Solo actúa en ese sitio; el resto de hábitats no se ven afectados.

ROV.modelTest = {
    siteKey: 'model-test',
    base: 'assets/models/model-test/',
    models: [
        { id: 'navonly-glb', base: 'assets/models/model-navonly/', file: 'odm_textured_model_geo.glb', label: 'S0883 Navonly full-track (ghost-free) — GLB' },
        { id: 'navonly-ribbon-glb', base: 'assets/models/model-navonly-ribbon/', file: 'ribbon_leveled.glb', label: 'S0883 Navonly ribbon (leveled, floating) — GLB' },
        { id: 'navonly-clean-glb', base: 'assets/models/model-navonly-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Navonly clean (curl-cut, ghost-free) — GLB' },
        { id: 'navonly-clean-yup-glb', base: 'assets/models/model-navonly-clean-yup/', file: 'odm_textured_model_geo_yup.glb', label: 'S0883 Navonly clean Y-up (level, ghost-free) — GLB' },
        { id: 'navonly-sheet-yup-glb', base: 'assets/models/model-navonly-sheet-yup/', file: 'sheet_leveled_yup.glb', label: 'S0883 Navonly sheet Y-up (ultra detail, leveled) — GLB' },
        { id: 'navonly-optA-glb', base: 'assets/models/model-navonly-optA/', file: 'optA_settled_yup.glb', label: 'S0883 Navonly optA (settled overlay, double-surface) — GLB' },
        { id: 'hero3-clean-yup-glb', base: 'assets/models/model-hero3-clean-yup/', file: 'hero3_clean_yup.glb', label: 'S0883 Hero3 clean Y-up (island detail) — GLB' },
        { id: 'layers-yup-ds-glb', base: 'assets/models/model-layers-yup-ds/', file: 'layers_yup_ds.glb', label: 'S0883 Layers Y-up DoubleSided (bone row, 24deg grade) — GLB' },
        { id: 'loose-yup-ds-glb', base: 'assets/models/model-loose-yup-ds/', file: 'loose_yup_ds.glb', label: 'S0883 Loose Y-up DoubleSided (bent terrain, experimental) — GLB' },
        { id: 'noflip-yup-ds-glb', base: 'assets/models/model-noflip-yup-ds/', file: 'noflip_yup_ds.glb', label: 'S0883 Noflip Y-up DoubleSided (bent terrain, experimental) — GLB' },
        { id: 'navonly-sheet-ds-glb', base: 'assets/models/model-navonly-sheet-ds/', file: 'sheet_yup_ds.glb', label: 'S0883 Navonly sheet Y-up DoubleSided (ultra detail, leveled) — GLB' },
        { id: 'navonly-sheet-trim-glb', base: 'assets/models/model-navonly-sheet-trim/', file: 'sheet_trim1m_ds.glb', label: 'S0883 Navonly sheet trim 1m (tail-trimmed, experimental) — GLB' },
        { id: 'hero3nav-glb', base: 'assets/models/model-hero3nav/', file: 'hero3nav_yup.glb', label: 'S0883 Hero3 NAV-only island (level, 3deg) — GLB' },
        { id: 'hero3sift-glb', base: 'assets/models/model-hero3sift/', file: 'hero3sift_yup.glb', label: 'S0883 Hero3 SIFT island (flattest, 1.5deg) — GLB' },
        { id: 'ribbon-tuned-glb', base: 'assets/models/model-ribbon-tuned/', file: 'ribbon_tuned_yup.glb', label: 'S0883 Ribbon vertebrae pieces (16fr, tuned) — GLB' },
        { id: 'ribbon-tuned-fs-glb', base: 'assets/models/model-ribbon-tuned-fs/', file: 'tuned_yup_fs.glb', label: 'S0883 Ribbon tuned FrontSide clean (Erwin, texture-top) — GLB' },
        { id: 'ribbon-standalone-tuned-glb', base: 'assets/models/model-ribbon-standalone/', file: 'ribbon_standalone_fs.glb', label: 'S0883 Ribbon standalone tuned (flipped FrontSide) — GLB' },
        { id: 'ribbon-standalone-base-glb', base: 'assets/models/model-ribbon-standalone-base/', file: 'ribbon_standalone_base_fs.glb', label: 'S0883 Ribbon standalone baseline (minimal, flipped FrontSide) — GLB' },
        { id: 'ribbon-standalone-lit-glb', base: 'assets/models/model-ribbon-standalone-lit/', file: 'ribbon_standalone_lit_fs.glb', label: 'S0883 Ribbon standalone lighting-leveled (flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c1-substrip-glb', base: 'assets/models/model-ribbon-join-c1/', file: 'c1_substrip_placed.glb', label: 'S0883 Ribbon join C1 narrow-fit sub-strip (attempt, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c1-full-glb', base: 'assets/models/model-ribbon-join-c1/', file: 'c1_ribbon_placed_full.glb', label: 'S0883 Ribbon join C1 full ribbon in place (attempt, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c2-glb', base: 'assets/models/model-ribbon-join-c2/', file: 'ribbon_join_c2.glb', label: 'S0883 Ribbon join C2 broad-fit (attempt, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c3-glb', base: 'assets/models/model-ribbon-join-c3/', file: 'join_c3_attempt.glb', label: 'S0883 Ribbon join C3 stump-top fit (attempt NEGATIVE on specificity, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c3r-glb', base: 'assets/models/model-ribbon-join-c3r/', file: 'join_c3_rebuilt.glb', label: 'S0883 Ribbon join C3 rebuilt (corrected placement, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c4-glb', base: 'assets/models/model-ribbon-join-c4/', file: 'join_c4_attempt.glb', label: 'S0883 Ribbon join C4 A2-x-interruption (attempt NEGATIVE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c5-glb', base: 'assets/models/model-ribbon-join-c5/', file: 'join_c5_attempt.glb', label: 'S0883 Ribbon join C5 bright-half (attempt NEGATIVE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c6-glb', base: 'assets/models/model-ribbon-join-c6/', file: 'join_c6_attempt.glb', label: 'S0883 Ribbon join C6 max-dark-x-interruption (attempt NEGATIVE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c7-glb', base: 'assets/models/model-ribbon-join-c7/', file: 'join_c7_attempt.glb', label: 'S0883 Ribbon join C7 east-x-interruption (attempt NEGATIVE, donor axis closed, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c8-glb', base: 'assets/models/model-ribbon-join-c8/', file: 'join_c8_attempt.glb', label: 'S0883 Ribbon join C8 single-block transplant (COMPATIBLE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c9-glb', base: 'assets/models/model-ribbon-join-c9/', file: 'join_c9_attempt.glb', label: 'S0883 Ribbon join C9 all-window-x-stumps (variant CLOSED, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c10-s300-glb', base: 'assets/models/model-ribbon-join-c10/', file: 'join_c10_s-3.00.glb', label: 'S0883 Ribbon join C10 seat s-3.00 (sweep center, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c10-s255-glb', base: 'assets/models/model-ribbon-join-c10/', file: 'join_c10_s-2.55.glb', label: 'S0883 Ribbon join C10 seat s-2.55 (sweep, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c10-s345-glb', base: 'assets/models/model-ribbon-join-c10/', file: 'join_c10_s-3.45.glb', label: 'S0883 Ribbon join C10 seat s-3.45 (sweep, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c11-glb', base: 'assets/models/model-ribbon-join-c11/', file: 'join_c11_attempt.glb', label: 'S0883 Ribbon join C11 NE-gap transplant (attempt NEGATIVE scar-not-socket, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c12-glb', base: 'assets/models/model-ribbon-join-c12/', file: 'join_c12_attempt.glb', label: 'S0883 Ribbon join C12 all-window-x-interruption (variant CLOSED, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c15-glb', base: 'assets/models/model-ribbon-join-c15/', file: 'join_c15_attempt.glb', label: 'S0883 Ribbon join C15 attitude-free fit (leveling NOT the blocker, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c16a-glb', base: 'assets/models/model-ribbon-join-c16/', file: 'join_c16_a_incolumn.glb', label: 'S0883 Ribbon join C16 control in-column seat (discriminator control, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c16b-glb', base: 'assets/models/model-ribbon-join-c16/', file: 'join_c16_b_patch.glb', label: 'S0883 Ribbon join C16 control flush-patch seat (discriminator control, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c17-glb', base: 'assets/models/model-ribbon-join-c17/', file: 'join_c17_attempt.glb', label: 'S0883 Ribbon join C17 micro-bit refit (split verdict, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c18-glb', base: 'assets/models/model-ribbon-join-c18/', file: 'join_c18_attempt.glb', label: 'S0883 Ribbon join C18 A2-donor control (NEGATIVE on substance, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c19-glb', base: 'assets/models/model-ribbon-join-c19/', file: 'join_c19_attempt.glb', label: 'S0883 Ribbon join C19 contact congruence (INCONCLUSIVE-by-control, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c20-glb', base: 'assets/models/model-ribbon-join-c20/', file: 'join_c20_attempt.glb', label: 'S0883 Ribbon join C20 A2 donor control (NEGATIVE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c21-glb', base: 'assets/models/model-ribbon-join-c21/', file: 'join_c21_attempt.glb', label: 'S0883 Ribbon join C21 fracture-site receiver (site OCCUPIED, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c27-glb', base: 'assets/models/model-ribbon-join-c27/', file: 'join_c27_attempt.glb', label: 'S0883 Ribbon join C27 vertical restack (NEGATIVE too tall, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c28-glb', base: 'assets/models/model-ribbon-join-c28/', file: 'join_c28_attempt.glb', label: 'S0883 Ribbon join C28 wall-conforming fit (NEGATIVE level vindicated, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c29-glb', base: 'assets/models/model-ribbon-join-c29/', file: 'join_c29_attempt.glb', label: 'S0883 Ribbon join C29 twin-dome donor (COMPATIBLE, flipped FrontSide) — GLB' },
        { id: 'ribbon-join-c30-glb', base: 'assets/models/model-ribbon-join-c30/', file: 'join_c30_attempt.glb', label: 'S0883 Ribbon join C30 cap restack (BORDERLINE, flipped FrontSide) — GLB (NEW)' },
        { id: 'ribbon-join-c32-glb', base: 'assets/models/model-ribbon-join-c32/', file: 'join_c32_attempt.glb', label: 'S0883 Ribbon join C32 twin-x-NE-slots (NEGATIVE harder, flipped FrontSide) — GLB (NEW)' },
        { id: 'navonly-ultra-yup-glb', base: 'assets/models/model-navonly-ultra-yup/', file: 'odm_textured_model_geo_ultra_yup.glb', label: 'S0883 Navonly ultra Y-up (raw, densest) — GLB' }
    ],
    // ARCHIVED 2026-09-24 (user order): all pre-navonly entries moved OUT of the
    // loading list. Inert data only — find()/resolve()/init()/swap() read `models`
    // above, so archived ids no longer load (?model=<archived> falls back to default).
    // GLB files stay in the repo untouched. To restore, move entries back into `models`.
    // Explicit default pin: navonly-ultra-yup is LAST so defaultId() keeps resolving to it
    // (newest-default rule survives verbatim — future uploads append after it and take
    // over as default automatically). Do NOT reorder without a user order.
    archived: [
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
        { id: 'full-loose-clean-glb', base: 'assets/models/model-full-loose-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Full-loose clean — GLB' },
        { id: 'noflip-clean-glb', base: 'assets/models/model-noflip-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Noflip clean — GLB' },
        { id: 'layers-clean-glb', base: 'assets/models/model-layers-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Layers clean — GLB' },
        { id: 'scalefix-glb', base: 'assets/models/model-scalefix/', file: 'odm_textured_model_geo.glb', label: 'S0883 Scalefix (experimental) — GLB' },
        { id: 'hero3-glb', base: 'assets/models/model-hero3/', file: 'odm_textured_model_geo.glb', label: 'S0883 Hero3 island (VR candidate) — GLB' },
        { id: 'hero3-clean-glb', base: 'assets/models/model-hero3-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Hero3 clean — GLB' },
        { id: 'scalefix-clean-glb', base: 'assets/models/model-scalefix-clean/', file: 'odm_textured_model_geo_clean.glb', label: 'S0883 Scalefix clean — GLB' }
    ],
    current: 'glb',
    // Load serialization: A-Frame 1.4.2 gltf-model has no stale-load guard —
    // every in-flight load attaches on arrival (last arrival wins). A swap
    // issued while another load is in flight would lose to the older bytes:
    // console shows model-loaded but the OLD mesh stays on screen. So only
    // one load flies at a time; a pick made mid-load is queued (latest wins)
    // and initiates when the in-flight load settles. `loading` is also set
    // by loader.js for the initial test-site load.
    loading: false,
    _pending: null,
    _wired: false,
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

        // Settlement hook (once): clears the in-flight flag on every load or
        // error and starts a queued pick, if any. loader.js sets `loading`
        // for the initial test-site load so an early pick queues instead of
        // racing it.
        if (!this._wired) {
            this._wired = true;
            const mapEntity = document.getElementById('map-entity');
            if (mapEntity) {
                mapEntity.addEventListener('model-loaded', () => this._settle());
                mapEntity.addEventListener('model-error', () => this._settle());
            }
        }
    },

    _settle: function () {
        this.loading = false;
        const next = this._pending;
        this._pending = null;
        if (next && next !== this.current) {
            this.swap(next);
        } else {
            const sel = document.getElementById('model-select');
            if (sel) sel.value = this.current;
        }
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

        // A pick made while a load is in flight is queued (latest wins) —
        // initiating it now would race and the older bytes could win.
        if (this._wired && this.loading) {
            this._pending = m.id;
            const queued = document.getElementById('model-select');
            if (queued) queued.value = m.id;
            const debugQ = document.getElementById('debug-console');
            if (debugQ) debugQ.textContent = `SYSTEM: Queued model ${m.label}...`;
            console.log(`[ModelTest] Queued ${m.id} (load in flight)`);
            return;
        }

        const debug = document.getElementById('debug-console');
        if (debug) debug.textContent = `SYSTEM: Loading model ${m.label}...`;

        mapEntity.removeAttribute('gltf-model');
        mapEntity.removeAttribute('obj-model');

        this.current = m.id;
        this.activeBase = this.dirFor(m);
        this.loading = true;

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
