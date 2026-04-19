# 📘 Documentación Técnica — Simulador ROV (vidaenlosextremos-vr)

## Estado de sincronización

- **Versión del documento:** 2.0
- **Sincronizado contra commit:** `009ccad`
- **Fecha commit base:** `2026-04-19 17:03:16 -0300`
- **Última actualización docs:** `2026-04-19`

> Esta documentación describe el estado real del código en el commit indicado arriba.

---

## 1) Arquitectura general

El proyecto usa una arquitectura modular en JavaScript vanilla sobre A-Frame/Three.js.

### Flujo de arranque
1. `index.html` (selección)
2. `habitat.html` (runtime)
3. Carga scripts en este orden:
   - `js/core/*`
   - `js/systems/*`
   - `js/input/*`
   - `js/loader.js`
   - `js/rov-main.js`

### Módulos
- **Core (`js/core`)**: namespace, config base, estado mutable, refs DOM.
- **Systems (`js/systems`)**: física, acciones, modelo, blending visual, waypoints, modal, localización, UI de controles.
- **Input (`js/input`)**: teclado + gamepad + touch/drag look.
- **App (`js/loader.js`, `js/rov-main.js`)**: hidratación de datos y loop principal.

---

## 2) Mapa técnico por archivo

### 2.1 Core
- `rov-init.js`: crea `window.ROV` y submódulos.
- `rov-settings.js`: constantes de control/sensibilidad/velocidad.
- `rov-state.js`: estado en runtime (HUD, menús, waypoint activo, debounce, etc.).
- `rov-dom.js`: cache de elementos de UI y escena.

### 2.2 Systems
- `rov-physics.js`: movimiento vectorial + restricciones de piso.
- `rov-actions.js`: acciones discretas (HUD, reset, gyro, speed, scan, look).
- `rov-model-handler.js`: post-proceso de modelos (escala, texturas, ajustes).
- `rov-visual-blender.js`: máscara/bordes y height blending.
- `rov-waypoints.js`: spawn, proximidad, modo gamificado, progreso misión.
- `rov-modal.js`: render de contenido waypoint (video/galería/texto).
- `rov-controls-ui.js`: menú del sistema, overlay de controles y navegación/back.
- `localization.js`: i18n ES/EN y actualización DOM.

### 2.3 Input
- `rov-input-keyboard.js`: keydown/keyup + polling por frame.
- `rov-controls.js`: gamepad, botones touch hold y drag look.

### 2.4 Orquestación
- `loader.js`: parsea query `site`, carga `dives.json`, setea spawn/config y modelo.
- `rov-main.js`: game loop (`requestAnimationFrame`) y throttling de UI/waypoints.

---

## 3) Datos y contrato

### 3.1 `data/dives.json`
Define cada misión:
- metadatos (`id`, `title`, `depth`, etc.)
- ruta de modelo (`model_path`)
- spawn (`start_position`, `start_rotation`)
- estilo/limitaciones de piso (`floor_color`, opcional `floor_limit`)

### 3.2 `data/waypoints.json`
Lista de waypoints por misión:
- `id`, `position`, `title`, `icon`
- `content` (descripción, video, galería, etc.)

### 3.3 Locales
- `locales/es.json`
- `locales/en.json`

Claves deben mantenerse en paridad entre ambos idiomas.

### 3.4 Build metadata
- `data/version.json` registra hash/mensaje/timestamp de build manual.
- Puede diferir de `git HEAD` si no se ejecutó actualización de versión.

---

## 4) Inputs (estado actual)

### Teclado
- Movimiento: WASD
- Cámara: flechas
- Vertical: Space/Shift
- Zoom: E/Q
- Speed: 1/2
- Scan: Enter
- HUD: H
- Reset: R
- Menú: M o Escape

### Gamepad
- LS: mover
- RS: cámara
- L1/R1: vertical
- L2/R2: zoom
- D-pad arriba/abajo: speed
- Cross/A: scan contextual (si hay waypoint activo)
- Square/X: HUD
- Select/Share: reset
- Start: menú

### Touch
- Botones de presión sostenida para mover/zoom/vertical
- Drag en área libre para cámara

---

## 5) Rendimiento

- Update crítico (física/input) en cada frame.
- Actualizaciones costosas de UI y chequeo de waypoints con throttling.
- Se prioriza estabilidad móvil evitando escrituras de DOM innecesarias por frame.

---

## 6) Procedimiento para mantener docs vigentes

Antes de cerrar cambios de documentación:

```bash
git rev-parse --short HEAD
git show -s --format=%ci HEAD
```

Luego:
1. Reemplazar hash/fecha en este archivo y en `README.md`.
2. Confirmar que los controles listados coincidan con `js/input/*` y `js/systems/rov-controls-ui.js`.
3. Confirmar rutas/estructura contra árbol real del repo.
