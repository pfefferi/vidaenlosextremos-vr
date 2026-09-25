// rov-settings.js
// Configuración estática y constantes
ROV.config = {
    // Finer-grained ladder: more steps DOWN toward 0.05 and UP toward 1.5.
    // Default level (0.5) unchanged — see rov-state.js currentLevelIndex.
    speedLevels: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.9, 1.0, 1.2, 1.5],
    baseDepth: 0,
    deadzone: 0.15,
    touchSensitivity: 0.15,
    mouseSensitivity: 0.2, // Nuevo: Sensibilidad para el ratón
    baseZoomSpeed: 0.8,

    // baseMoveSpeed se calculará dinámicamente al cargar el modelo en el Main
    // (x10 forward-speed boost; model-handler applies the same factor on load)
    baseMoveSpeed: 0.4
};
