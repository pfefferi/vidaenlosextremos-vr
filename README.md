# VIDA EN LOS EXTREMOS: ROV Mission Control

Visualizador 3D interactivo para explorar hábitats marinos profundos con una interfaz estilo telemetría de ROV.

---

## 📌 Estado de documentación

- **Docs sincronizadas con Git:** `009ccad`  
- **Fecha del commit base:** `2026-04-19 17:03:16 -0300`
- **Archivo de build interno:** `data/version.json` (puede quedar desfasado respecto a `HEAD`)

> Al actualizar documentación, reemplazar este bloque con el nuevo hash de `HEAD`.

Comandos útiles:

```bash
git rev-parse --short HEAD
git show -s --format=%ci HEAD
```

---

## 🌊 Misiones disponibles

- `whale-fall` — **S0883: The Whale Fall**
- `clam-bed` — **S0889: Vesicomyidae Clam Bed**
- `giant-corals` — **S0892: Giant Corals (Paragorgia sp.)**

La app se abre desde `index.html` y navega al visor en `habitat.html?site=<mission_key>`.

---

## 🧱 Arquitectura actual

### Entry points
- `index.html` → menú de selección
- `habitat.html` → runtime del simulador

### JavaScript
- `js/core/` → init, config, estado mutable, refs DOM
- `js/systems/` → física, acciones, waypoints, modal, localización, model pipeline
- `js/input/` → teclado, gamepad, touch/drag look
- `js/loader.js` → carga datos de misión y modelo
- `js/rov-main.js` → game loop y orquestación

### Datos
- `data/dives.json` → configuración por misión (telemetría, spawn, modelo, color de piso)
- `data/waypoints.json` → puntos de interés y contenido
- `locales/es.json`, `locales/en.json` → traducciones
- `data/version.json` → metadata de build/log

---

## 🎮 Controles principales

### Teclado
- Movimiento: `W A S D`
- Cámara: `Flechas`
- Subir/Bajar: `Espacio` / `Shift`
- Zoom: `E` (in) / `Q` (out)
- Velocidad: `1` / `2`
- Escanear waypoint: `Enter`
- HUD: `H`
- Reset posición: `R`
- Menú sistema: `M` o `Esc`

### Gamepad
- Move/strafe: `Stick izquierdo`
- Cámara: `Stick derecho`
- Subir/Bajar: `L1 / R1`
- Zoom: `L2 / R2`
- Velocidad: `D-pad ↑ / ↓`
- Escanear waypoint: `Cross / A` (cuando hay waypoint activo)
- HUD: `Square / X`
- Reset posición: `Select / Share`
- Menú sistema: `Start / Options`

### Touch / móvil
- D-pad virtual + botones laterales para movimiento/acciones
- Drag en zona libre para rotación de cámara
- Menú y panel de controles en overlay

---

## ▶️ Ejecución local

Por CORS, usar servidor local.

```bash
# opción Python
python -m http.server 8000
```

Abrir en navegador:

- `http://localhost:8000/index.html`

---

## 🛠️ Mantenimiento de docs

Cuando cambie arquitectura/controles:
1. Actualizar `README.md` y `docs/DOCUMENTACION-TECNICA.md`.
2. Reemplazar el hash en “Estado de documentación”.
3. Verificar que rutas y nombres de archivo coincidan con el árbol real del repo.

---

## Créditos

Proyecto educativo/científico asociado a la campaña FKt251206 Bravo.

- Schmidt Ocean Institute — R/V Falkor (too), ROV SuBastian
- Datos/Modelos 3D: Ben Erwin
- Dirección científica: María Emilia Bravo
- Desarrollo: Lisandro Scarrone
