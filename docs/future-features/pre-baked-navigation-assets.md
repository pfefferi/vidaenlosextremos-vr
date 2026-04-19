# Pre-Baked Navigation Assets

## Documentation Sync
- Synced against commit: `009ccad`
- Sync date: `2026-04-19`
- Status: Future optimization (not implemented in production flow)

---

## Status: Future Optimization
**Priority**: Low — runtime generation adds ~250ms to load time, negligible vs model download (2-5s).  
**Trigger**: Implement when manual control over navigation boundaries is needed.

## Concept

The runtime-generated heightmap and silhouette mask can be exported as static image assets and loaded instead of computed. This saves ~250ms of load time and enables **manual editing** of navigation boundaries.

## Current Runtime Pipeline

```
Model loads → vertex traversal → generates:
  1. Silhouette mask (512x512 canvas → CanvasTexture) — used for edge fade
  2. Heightmap (512x512 Float32Array) — used for terrain-following floor
```

Both use the same two-pass vertex projection in `rov-visual-blender.js`.

## Pre-Baked Pipeline (Future)

### Export Phase (one-time per model)
1. Enable debug canvas in `rov-visual-blender.js`
2. Load the habitat in browser
3. Save debug canvas as `mask.png`
4. Export heightmap as grayscale PNG
5. Place files in `assets/models/{habitat}/`

### Load Phase (runtime)
```
dives.json has "mask_path" and "heightmap_path"?
  → YES: Load PNGs as textures (fast, ~50ms)
  → NO:  Generate at runtime (current behavior, ~250ms)
```

### Manual Editing Benefits
- Paint no-go zones onto the heightmap in Photoshop (invisible walls)
- Smooth jagged collision areas without changing the model
- Artificially raise terrain where the ROV shouldn't reach
- Add visual-only boundaries to the silhouette mask

## File Structure (proposal)
```
assets/models/whale-fall/
  ├── scene.gltf
  ├── textures/
  ├── mask.png          ← pre-baked silhouette mask (optional)
  └── heightmap.png     ← pre-baked terrain heightmap (optional)
```

## `dives.json` Schema Addition (proposal)
```json
{
  "whale-fall": {
    "mask_path": "assets/models/whale-fall/mask.png",
    "heightmap_path": "assets/models/whale-fall/heightmap.png"
  }
}
```

## Implementation Notes
- Silhouette mask: RGBA PNG, red channel used.
- Heightmap: grayscale PNG, 0=lowest point, 255=highest.
- Bounds metadata is still required (`minX`, `maxX`, `minZ`, `maxZ`) via JSON or metadata sidecar.
- Keep runtime fallback so new models work immediately.
