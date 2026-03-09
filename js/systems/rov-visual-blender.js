/* global THREE, ROV */

/**
 * ROV Visual Blender System v2.0
 * Auto-generates a silhouette mask from model geometry and applies it as an edge fade.
 * No hardcoded coordinates — works for any model shape.
 */
ROV.blender = {

  /**
   * Generates a top-down silhouette mask from the model's actual geometry.
   * Projects all triangles onto the XZ plane, renders them white-on-black,
   * then blurs the edges for a smooth fade gradient.
   *
   * @param {THREE.Object3D} mesh - The loaded GLTF model.
   * @param {number} resolution - Canvas resolution in pixels (default 512).
   * @param {number} blurPasses - Number of box-blur passes for edge softness (default 4).
   * @param {number} blurRadius - Pixel radius per blur pass (default 8).
   * @param {number} padding - Fraction of bounds to add as padding for fade space (default 0.05).
   * @returns {{ texture: THREE.CanvasTexture, bounds: {minX: number, maxX: number, minZ: number, maxZ: number} }}
   */
  generateSilhouetteMask: function (mesh, resolution = 512, blurPasses = 4, blurRadius = 8, padding = 0.15) {
    // 1. Ensure world matrices are up-to-date (critical after entity scale/position changes)
    mesh.updateWorldMatrix(true, true);

    // Compute world-space bounding box
    const bbox = new THREE.Box3().setFromObject(mesh);
    const minX = bbox.min.x;
    const maxX = bbox.max.x;
    const minZ = bbox.min.z;
    const maxZ = bbox.max.z;

    // Add padding so the fade has room to dissolve outside the geometry
    const rangeX = maxX - minX;
    const rangeZ = maxZ - minZ;
    const padX = rangeX * padding;
    const padZ = rangeZ * padding;

    const bounds = {
      minX: minX - padX,
      maxX: maxX + padX,
      minZ: minZ - padZ,
      maxZ: maxZ + padZ
    };

    const bWidth = bounds.maxX - bounds.minX;
    const bHeight = bounds.maxZ - bounds.minZ;

    // 2. Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    // Start with black (fully transparent in our mask)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, resolution, resolution);

    // 3. Project and draw triangles
    ctx.fillStyle = '#ffffff';

    mesh.traverse((node) => {
      if (!node.isMesh || !node.geometry) return;

      // Ensure world matrix is up to date
      node.updateWorldMatrix(true, false);
      const worldMatrix = node.matrixWorld;

      const geometry = node.geometry;
      const posAttr = geometry.attributes.position;
      if (!posAttr) return;

      const index = geometry.index;
      const vertex = new THREE.Vector3();

      // Helper: project a vertex index to canvas pixel coords
      const projectToCanvas = (vi) => {
        vertex.set(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi));
        vertex.applyMatrix4(worldMatrix);
        // Map world XZ to canvas pixels
        const px = ((vertex.x - bounds.minX) / bWidth) * resolution;
        const py = ((vertex.z - bounds.minZ) / bHeight) * resolution;
        return { x: px, y: py };
      };

      if (index) {
        // Indexed geometry: draw triangles from index buffer
        for (let i = 0; i < index.count; i += 3) {
          const a = projectToCanvas(index.getX(i));
          const b = projectToCanvas(index.getX(i + 1));
          const c = projectToCanvas(index.getX(i + 2));

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Non-indexed: every 3 vertices form a triangle
        for (let i = 0; i < posAttr.count; i += 3) {
          const a = projectToCanvas(i);
          const b = projectToCanvas(i + 1);
          const c = projectToCanvas(i + 2);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // 4. Solidify interior: threshold any non-zero pixel to full white
    // This closes sub-pixel gaps between triangles in photogrammetry meshes
    const solidifyData = ctx.getImageData(0, 0, resolution, resolution);
    const pixels = solidifyData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const val = pixels[i] > 0 ? 255 : 0;
      pixels[i] = val;
      pixels[i + 1] = val;
      pixels[i + 2] = val;
      pixels[i + 3] = 255;
    }
    ctx.putImageData(solidifyData, 0, 0);

    // 5. Apply box blur for soft edges
    this._boxBlur(ctx, resolution, resolution, blurRadius, blurPasses);

    // 5. Create Three.js texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    console.log(`[Blender] Silhouette mask generated (${resolution}x${resolution})`);

    // DEBUG: Show mask canvas in corner
    canvas.style.cssText = 'position:fixed;bottom:10px;left:10px;width:200px;height:200px;z-index:9999;border:2px solid red;image-rendering:pixelated;';
    canvas.id = 'debug-mask-canvas';
    const old = document.getElementById('debug-mask-canvas');
    if (old) old.remove();
    document.body.appendChild(canvas);

    return { texture, bounds };
  },

  /**
   * Applies the generated silhouette mask as an alpha fade to all model materials.
   *
   * @param {THREE.Object3D} mesh - The GLTF model.
   * @param {{ texture: THREE.CanvasTexture, bounds: Object }} maskData - Output from generateSilhouetteMask.
   */
  applyMaskFade: function (mesh, maskData) {
    if (!mesh || !maskData) return;

    const { texture, bounds } = maskData;

    mesh.traverse((node) => {
      if (!node.isMesh || !node.material) return;

      const materials = Array.isArray(node.material) ? node.material : [node.material];

      materials.forEach((mat) => {
        mat.transparent = true;
        mat.depthWrite = true;

        mat.onBeforeCompile = (shader) => {
          // 1. Uniforms
          shader.uniforms.uMaskTex = { value: texture };
          shader.uniforms.uBoundsMinX = { value: bounds.minX };
          shader.uniforms.uBoundsMaxX = { value: bounds.maxX };
          shader.uniforms.uBoundsMinZ = { value: bounds.minZ };
          shader.uniforms.uBoundsMaxZ = { value: bounds.maxZ };

          // 2. Vertex: pass world position to fragment
          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `#include <common>
             varying vec3 vWorldPos;`
          );

          shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            `#include <worldpos_vertex>
             vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
          );

          // 3. Fragment: sample mask and apply alpha
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `#include <common>
             varying vec3 vWorldPos;
             uniform sampler2D uMaskTex;
             uniform float uBoundsMinX;
             uniform float uBoundsMaxX;
             uniform float uBoundsMinZ;
             uniform float uBoundsMaxZ;`
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
             // Map world XZ position to mask UV [0,1]
             float maskU = (vWorldPos.x - uBoundsMinX) / (uBoundsMaxX - uBoundsMinX);
             float maskV = (vWorldPos.z - uBoundsMinZ) / (uBoundsMaxZ - uBoundsMinZ);
             vec2 maskUV = clamp(vec2(maskU, maskV), 0.0, 1.0);
             float maskAlpha = texture2D(uMaskTex, maskUV).r;
             // DEBUG: bright red outline where mask transitions
             if (maskAlpha > 0.05 && maskAlpha < 0.95) {
               gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
             } else {
               gl_FragColor.a *= maskAlpha;
             }`
          );
        };

        mat.needsUpdate = true;
      });
    });

    console.log('[Blender] Mask fade applied to model materials');
  },

  /**
   * Multi-pass box blur on canvas ImageData.
   * @private
   */
  _boxBlur: function (ctx, w, h, radius, passes) {
    for (let p = 0; p < passes; p++) {
      const imageData = ctx.getImageData(0, 0, w, h);
      const src = imageData.data;
      const dst = new Uint8ClampedArray(src.length);

      // Horizontal pass
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0, count = 0;
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            if (nx >= 0 && nx < w) {
              sum += src[(y * w + nx) * 4]; // Red channel only
              count++;
            }
          }
          dst[(y * w + x) * 4] = sum / count;
          dst[(y * w + x) * 4 + 1] = sum / count;
          dst[(y * w + x) * 4 + 2] = sum / count;
          dst[(y * w + x) * 4 + 3] = 255;
        }
      }

      // Vertical pass
      const dst2 = new Uint8ClampedArray(src.length);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0, count = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            const ny = y + dy;
            if (ny >= 0 && ny < h) {
              sum += dst[(ny * w + x) * 4];
              count++;
            }
          }
          dst2[(y * w + x) * 4] = sum / count;
          dst2[(y * w + x) * 4 + 1] = sum / count;
          dst2[(y * w + x) * 4 + 2] = sum / count;
          dst2[(y * w + x) * 4 + 3] = 255;
        }
      }

      ctx.putImageData(new ImageData(dst2, w, h), 0, 0);
    }
  }
};
