// js/systems/rov-waypoints.js

ROV.waypoints = {
    list: [],
    uiBtn: null,
    uiExplore: null, // Referencia al texto Explore

    init: function () {
        ROV.state.activeWaypoint = null;

        // Referencias DOM
        this.uiBtn = document.getElementById('btn-scan');
        this.uiExplore = document.getElementById('explore-label');

        if (this.uiBtn) {
            this.uiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ROV.actions.scanWaypoint();
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        let site = urlParams.get('site');

        if (!site) {
            const path = window.location.pathname;
            site = path.split("/").pop().split(".")[0];
        }

        const missionKey = site.replace(/_/g, "-");

        fetch('data/waypoints.json')
            .then(res => res.json())
            .then(data => {
                const points = data[missionKey];
                if (points && points.length > 0) this.spawn(points);
            })
            .catch(err => console.error("[Waypoints] Error:", err));
    },

    spawn: function (data) {
        const scene = document.querySelector('a-scene');

        data.forEach(wpData => {
            // 1. Crear Entidad 3D
            const el = document.createElement('a-entity');

            // Estado inicial: Esfera blanca pequeña y transparente (Ghost)
            el.setAttribute('geometry', 'primitive: sphere; radius: 0.15');
            el.setAttribute('material', 'color: #FFFFFF; shader: flat; opacity: 0.4; transparent: true');
            el.setAttribute('scale', '0.3 0.3 0.3');
            el.setAttribute('position', wpData.position);
            scene.appendChild(el);

            // 2. Guardar en Memoria (CON DATOS COMPLETOS)
            this.list.push({
                id: wpData.id,
                data: wpData, // <--- AQUÍ GUARDAMOS TODO EL JSON (titulo, video, etc)
                el: el,
                pos: new THREE.Vector3(wpData.position.x, wpData.position.y, wpData.position.z),
                active: false
            });
        });
    },

    update: function () {
        if (!ROV.refs.rig || this.list.length === 0) return;

        const currentPos = ROV.refs.rig.object3D.position;
        let nearestWp = null;
        let minDistance = 2.0; // THRESHOLD: Reduced from 3.5 to 2.0

        // 1. Encontrar el más cercano dentro del umbral
        this.list.forEach(wp => {
            const dist = currentPos.distanceTo(wp.pos);
            if (dist < minDistance) {
                minDistance = dist;
                nearestWp = wp;
            }
        });

        // 2. Actualizar estados y animaciones
        this.list.forEach(wp => {
            const isTarget = nearestWp && wp.id === nearestWp.id;

            if (isTarget !== wp.active) {
                wp.active = isTarget;

                if (isTarget) {
                    // Cerca y es el más cercano: Transformar en Diamante
                    wp.el.setAttribute('geometry', 'primitive: octahedron; radius: 0.2');
                    wp.el.setAttribute('scale', '0.45 0.85 0.45');
                    wp.el.setAttribute('material', 'opacity: 0.6');
                    wp.el.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear');
                } else {
                    // Lejos o no es el más cercano: Volver a Esfera
                    wp.el.setAttribute('geometry', 'primitive: sphere; radius: 0.15');
                    wp.el.setAttribute('scale', '0.3 0.3 0.3');
                    wp.el.setAttribute('material', 'opacity: 0.4');
                    wp.el.removeAttribute('animation');
                    wp.el.object3D.rotation.set(0, 0, 0);
                }
            }
        });

        // 3. Actualizar Estado Global
        const foundCandidate = nearestWp ? nearestWp.id : null;
        ROV.state.activeWaypoint = foundCandidate;

        // 4. Sincronizar UI
        this.syncUI(foundCandidate);
    },

    syncUI: function (activeId) {
        if (activeId) {
            // MOSTRAR
            if (this.uiBtn && this.uiBtn.classList.contains('ui-hidden')) {
                this.uiBtn.classList.remove('ui-hidden');
            }
            if (this.uiExplore && this.uiExplore.classList.contains('ui-hidden')) {
                this.uiExplore.classList.remove('ui-hidden');
            }
        } else {
            // OCULTAR
            if (this.uiBtn && !this.uiBtn.classList.contains('ui-hidden')) {
                this.uiBtn.classList.add('ui-hidden');
            }
            if (this.uiExplore && !this.uiExplore.classList.contains('ui-hidden')) {
                this.uiExplore.classList.add('ui-hidden');
            }
        }
    },

    // Método helper para buscar datos por ID
    getDataById: function (id) {
        const found = this.list.find(item => item.id === id);
        return found ? found.data : null;
    }
};
