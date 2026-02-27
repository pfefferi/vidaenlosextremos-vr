// rov-settings.js
// Configuración estática y constantes
ROV.config = {
    speedLevels: [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0, 3.0],
    baseDepth: 0,
    deadzone: 0.15,
    touchSensitivity: 0.15,
    mouseSensitivity: 0.2, // Nuevo: Sensibilidad para el ratón
    baseZoomSpeed: 0.8,

    // baseMoveSpeed se calculará dinámicamente al cargar el modelo en el Main
    baseMoveSpeed: 0.04
};
