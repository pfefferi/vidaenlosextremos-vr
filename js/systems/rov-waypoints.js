// js/systems/rov-waypoints.js

ROV.waypoints = {
    list: [],
    uiBtn: null,
    uiExplore: null,
    missionHUD: null,
    totalVisited: 0,
    config: {
        minDistance: 2.0, // STRICT: AS REQUESTED
        colorDefault: "#00aaff",
        colorVisited: "#00ff88"
    },

    init: function () {
        ROV.state.activeWaypoint = null;
        this.totalVisited = 0;

        // Referencias DOM
        this.uiBtn = document.getElementById('btn-scan');
        this.uiExplore = document.getElementById('explore-label');

        if (this.uiBtn) {
            this.uiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ROV.actions.scanWaypoint();
            });
        }

        // Inyectar HUD de Misión
        this.createMissionHUD();

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

    createMissionHUD: function () {
        if (document.getElementById('mission-counter')) return;

        const hud = document.createElement('div');
        hud.id = 'mission-counter';
        hud.style.position = 'fixed';
        hud.style.top = '80px';
        hud.style.right = '30px';
        hud.style.padding = '12px 20px';
        hud.style.background = 'rgba(0, 0, 0, 0.6)';
        hud.style.backdropFilter = 'blur(10px)';
        hud.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        hud.style.borderRadius = '4px';
        hud.style.color = '#fff';
        hud.style.fontFamily = "'Inter', sans-serif";
        hud.style.fontSize = '12px';
        hud.style.fontWeight = '800';
        hud.style.letterSpacing = '2px';
        hud.style.zIndex = '1000';
        hud.style.transition = 'all 0.3s ease';
        hud.innerHTML = 'SAMPLES ANALYZED: <span id="visited-count">0</span> / <span id="total-count">0</span>';

        document.body.appendChild(hud);
        this.missionHUD = hud;
    },

    spawn: function (data) {
        const scene = document.querySelector('a-scene');
        const totalCountEl = document.getElementById('total-count');
        if (totalCountEl) totalCountEl.innerText = data.length;

        data.forEach(wpData => {
            // Container Entity
            const container = document.createElement('a-entity');
            container.setAttribute('id', `beacon-${wpData.id}`);
            container.setAttribute('position', wpData.position);
            scene.appendChild(container);

            // 1. Core Sphere
            const sphere = document.createElement('a-entity');
            sphere.setAttribute('geometry', 'primitive: sphere; radius: 0.15');
            sphere.setAttribute('material', `color: ${this.config.colorDefault}; shader: flat; opacity: 0.6; transparent: true`);
            sphere.setAttribute('scale', '0.3 0.3 0.3');
            container.appendChild(sphere);

            // 2. Vertical Beam (Visible from afar)
            const beam = document.createElement('a-entity');
            beam.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 100');
            beam.setAttribute('material', `color: ${this.config.colorDefault}; shader: flat; opacity: 0.08; transparent: true`);
            beam.setAttribute('position', '0 50 0'); // Long beam up
            container.appendChild(beam);

            // 3. Sonar Pulse Ring (Effect)
            const ring = document.createElement('a-entity');
            ring.setAttribute('geometry', 'primitive: ring; radiusInner: 0.1; radiusOuter: 0.12');
            ring.setAttribute('material', `color: ${this.config.colorDefault}; shader: flat; opacity: 0.6; transparent: true`);
            ring.setAttribute('rotation', '-90 0 0');
            ring.setAttribute('animation__scale', 'property: scale; from: 1 1 1; to: 20 20 20; dur: 3000; loop: true; easing: easeOutQuad');
            ring.setAttribute('animation__fade', 'property: material.opacity; from: 0.6; to: 0; dur: 3000; loop: true; easing: easeOutQuad');
            container.appendChild(ring);

            // Store in memory
            this.list.push({
                id: wpData.id,
                data: wpData,
                el: container,
                sphere: sphere,
                beam: beam,
                ring: ring,
                pos: new THREE.Vector3(wpData.position.x, wpData.position.y, wpData.position.z),
                active: false,
                visited: false
            });
        });
    },

    update: function () {
        if (!ROV.refs.rig || this.list.length === 0) return;

        const currentPos = ROV.refs.rig.object3D.position;
        let nearestWp = null;
        let minDistance = this.config.minDistance;

        // 1. Find nearest within threshold
        this.list.forEach(wp => {
            const dist = currentPos.distanceTo(wp.pos);
            if (dist < minDistance) {
                minDistance = dist;
                nearestWp = wp;
            }
        });

        // 2. Update visuals based on distance
        this.list.forEach(wp => {
            const isTarget = nearestWp && wp.id === nearestWp.id;

            if (isTarget !== wp.active) {
                wp.active = isTarget;

                if (isTarget) {
                    // NEAR: Transform core, hide helper visuals
                    wp.sphere.setAttribute('geometry', 'primitive: octahedron; radius: 0.2');
                    wp.sphere.setAttribute('scale', '0.45 0.85 0.45');
                    wp.sphere.setAttribute('material', 'opacity: 0.8');
                    wp.sphere.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear');

                    wp.beam.setAttribute('visible', false);
                    wp.ring.setAttribute('visible', false);
                } else {
                    // FAR: Restore sphere, show helper visuals
                    wp.sphere.setAttribute('geometry', 'primitive: sphere; radius: 0.15');
                    wp.sphere.setAttribute('scale', '0.3 0.3 0.3');
                    wp.sphere.setAttribute('material', 'opacity: 0.6');
                    wp.sphere.removeAttribute('animation');
                    wp.sphere.object3D.rotation.set(0, 0, 0);

                    wp.beam.setAttribute('visible', true);
                    wp.ring.setAttribute('visible', true);
                }
            }
        });

        const foundCandidate = nearestWp ? nearestWp.id : null;
        ROV.state.activeWaypoint = foundCandidate;
        this.syncUI(foundCandidate);
    },

    markAsVisited: function (id) {
        const wp = this.list.find(item => item.id === id);
        if (!wp || wp.visited) return;

        wp.visited = true;
        this.totalVisited++;

        // Visual change: Permanent Green
        wp.sphere.setAttribute('material', 'color', this.config.colorVisited);
        wp.beam.setAttribute('material', 'color', this.config.colorVisited);
        wp.ring.setAttribute('material', 'color', this.config.colorVisited);

        // Update HUD
        const visitedCountEl = document.getElementById('visited-count');
        if (visitedCountEl) visitedCountEl.innerText = this.totalVisited;

        // Check Completion
        if (this.totalVisited === this.list.length) {
            this.missionComplete();
        }
    },

    missionComplete: function () {
        if (this.missionHUD) {
            this.missionHUD.style.borderColor = this.config.colorVisited;
            this.missionHUD.style.boxShadow = `0 0 20px ${this.config.colorVisited}44`;
            this.missionHUD.innerHTML += '<br><span style="color:' + this.config.colorVisited + '; display:block; margin-top:5px;">MISSION COMPLETE!</span>';
        }
        console.log("MISSION COMPLETE!");
    },

    syncUI: function (activeId) {
        if (activeId) {
            if (this.uiBtn && this.uiBtn.classList.contains('ui-hidden')) this.uiBtn.classList.remove('ui-hidden');
            if (this.uiExplore && this.uiExplore.classList.contains('ui-hidden')) this.uiExplore.classList.remove('ui-hidden');
        } else {
            if (this.uiBtn && !this.uiBtn.classList.contains('ui-hidden')) this.uiBtn.classList.add('ui-hidden');
            if (this.uiExplore && !this.uiExplore.classList.contains('ui-hidden')) this.uiExplore.classList.add('ui-hidden');
        }
    },

    getDataById: function (id) {
        const found = this.list.find(item => item.id === id);
        return found ? found.data : null;
    }
};
