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

        // UI Tabs
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabName);
        });

        // UI Views
        document.querySelectorAll('.controls-view').forEach(v => {
            v.classList.toggle('active', v.id === `view-${tabName}`);
        });

        // Dynamic Footer Hints
        const isGP = tabName === 'gamepad';
        const gpClose = document.getElementById('hint-gp-close');
        const gpSwitch = document.getElementById('hint-gp-switch');

        if (gpClose) gpClose.style.display = isGP ? 'inline-block' : 'none';
        if (gpSwitch) gpSwitch.style.display = isGP ? 'inline-block' : 'none';
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

    // Switch tab con TAB
    if (e.code === 'Tab' && ROV.state.isControlsOpen) {
        e.preventDefault();
        const next = ROV.controlsUI.currentTab === 'gamepad' ? 'keyboard' : 'gamepad';
        ROV.controlsUI.switchTab(next);
    }
});

// Hook en el loop del Gamepad para el botón B (Cerrar)
// Se llama desde rov-controls.js pero aquí capturamos la lógica de cierre si el overlay está abierto
ROV.controlsUI.checkGPExit = function (gp) {
    if (!ROV.state.isControlsOpen) return;

    // Botón B (Index 1) para cerrar
    if (gp.buttons[1].pressed) {
        ROV.controlsUI.toggle(false);
    }
};
