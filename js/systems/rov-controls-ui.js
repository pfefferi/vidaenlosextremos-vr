// js/systems/rov-controls-ui.js

ROV.controlsUI = {
    overlay: null,
    currentTab: 'gamepad',

    init: function () {
        this.overlay = document.getElementById('controls-overlay');
        this.setupEventListeners();
    },

    setupEventListeners: function () {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        const closeBtn = document.getElementById('close-controls');
        if (closeBtn) closeBtn.onclick = () => this.toggle(false);
    },

    toggle: function (show) {
        if (!this.overlay) this.init();

        const force = (show !== undefined) ? show : !this.overlay.classList.contains('active');

        if (force) {
            this.overlay.classList.add('active');
            ROV.state.isControlsOpen = true;
            // Detectar si hay gamepad para poner el tab por defecto
            const gamepads = navigator.getGamepads();
            let hasGP = false;
            for (let i = 0; i < gamepads.length; i++) { if (gamepads[i]) hasGP = true; }
            this.switchTab(hasGP ? 'gamepad' : 'keyboard');
        } else {
            this.overlay.classList.remove('active');
            ROV.state.isControlsOpen = false;
        }
    },

    switchTab: function (tabName) {
        this.currentTab = tabName;

        // UI
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabName);
        });

        document.querySelectorAll('.controls-view').forEach(v => {
            v.classList.toggle('active', v.id === `view-${tabName}`);
        });
    }
};

// Hook en el input de teclado (rov-input-keyboard.js debería manejarlo globalmente pero aquí va el Esc)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        if (ROV.state.isControlsOpen) {
            ROV.controlsUI.toggle(false);
        } else if (!ROV.state.isLogbookOpen) {
            ROV.controlsUI.toggle(true);
        }
    }

    // Nueva funcionalidad: Switch tab con TAB
    if (e.code === 'Tab' && ROV.state.isControlsOpen) {
        e.preventDefault();
        const next = ROV.controlsUI.currentTab === 'gamepad' ? 'keyboard' : 'gamepad';
        ROV.controlsUI.switchTab(next);
    }
});
