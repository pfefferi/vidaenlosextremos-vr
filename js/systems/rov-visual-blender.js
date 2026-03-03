/* global AFRAME, THREE, ROV */

/**
 * ROV Visual Blender System
 * Handles advanced shader injection for visual continuity.
 */
ROV.blender = {
  /**
   * Injects an alpha-fade logic into model materials.
   * Fades the model to transparency as it reaches its radial limits.
   * @param {THREE.Object3D} model - The GLTF model to modify.
   * @param {number} fadeRadius - The distance from center where fading begins.
   */
  applyEdgeFade: function (model, fadeRadius = 8) {
    if (!model) return;

    console.log(`[Blender] Applying Edge-Fade (Radius: ${fadeRadius})`);

    model.traverse((node) => {
      if (node.isMesh && node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];

        materials.forEach((mat) => {
          // Force transparency support
          mat.transparent = true;
          mat.depthWrite = true; // Keep depth for proper layering

          mat.onBeforeCompile = (shader) => {
            // 1. Define uniforms
            shader.uniforms.uFadeRadius = { value: fadeRadius };
            shader.uniforms.uFadeStart = { value: fadeRadius * 0.6 }; // Fade starts at 60% of radius

            // 2. Inject Varying for world position
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

            // 3. Inject Fragment shader logic
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
                             varying vec3 vWorldPos;
                             uniform float uFadeRadius;
                             uniform float uFadeStart;`
            );

            // Calculate distance from world 0,0 (xz plane) and apply to alpha
            const fadeCode = `
                            #include <dithering_fragment>
                            float distFromCenter = length(vWorldPos.xz);
                            float edgeAlpha = 1.0 - smoothstep(uFadeStart, uFadeRadius, distFromCenter);
                            gl_FragColor.a *= edgeAlpha;
                        `;

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <dithering_fragment>',
              fadeCode
            );
          };

          mat.needsUpdate = true;
        });
      }
    });
  },

  /**
   * Injects a rectangular alpha-fade logic into model materials based on world coordinates.
   * Fades the model to transparency at specified X/Z limits.
   * @param {THREE.Object3D} model - The GLTF model to modify.
   * @param {number} minX - The minimum X coordinate boundary.
   * @param {number} maxX - The maximum X coordinate boundary.
   * @param {number} minZ - The minimum Z coordinate boundary.
   * @param {number} maxZ - The maximum Z coordinate boundary.
   * @param {number} fadeDistance - How many units before the edge the fade begins.
   */
  applyBoxFade: function (model, minX, maxX, minZ, maxZ, fadeDistance = 1.5) {
    if (!model) return;

    console.log(`[Blender] Applying Box-Fade (X: ${minX} to ${maxX}, Z: ${minZ} to ${maxZ}, dist: ${fadeDistance})`);

    model.traverse((node) => {
      if (node.isMesh && node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];

        materials.forEach((mat) => {
          // Force transparency support and depth sorting
          mat.transparent = true;
          mat.depthWrite = true; // MUST keep depth for proper layering

          mat.onBeforeCompile = (shader) => {
            // 1. Define uniforms
            shader.uniforms.uMinX = { value: minX };
            shader.uniforms.uMaxX = { value: maxX };
            shader.uniforms.uMinZ = { value: minZ };
            shader.uniforms.uMaxZ = { value: maxZ };
            shader.uniforms.uFadeDist = { value: fadeDistance };

            // 2. Inject Varying for world position
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

            // 3. Inject Fragment shader logic
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
               varying vec3 vWorldPos;
               uniform float uMinX;
               uniform float uMaxX;
               uniform float uMinZ;
               uniform float uMaxZ;
               uniform float uFadeDist;`
            );

            // Calculate distance to the defined borders
            const fadeCode = `
              #include <dithering_fragment>
              
              // Find the distance to the nearest X boundary
              float distX = min(vWorldPos.x - uMinX, uMaxX - vWorldPos.x);
              
              // Find the distance to the nearest Z boundary
              float distZ = min(vWorldPos.z - uMinZ, uMaxZ - vWorldPos.z);
              
              // The closest boundary determines the fade (alpha)
              float distToEdge = min(distX, distZ);
              
              // Smooth transition to 0 alpha when distToEdge is small
              float edgeAlpha = smoothstep(0.0, uFadeDist, distToEdge);
              
              gl_FragColor.a *= edgeAlpha;
            `;

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <dithering_fragment>',
              fadeCode
            );
          };

          mat.needsUpdate = true;
        });
      }
    });
  }
};

// Also keep the old radial-blend for general plane use if needed
AFRAME.registerShader('radial-blend', {
  schema: {
    src: { type: 'map', is: 'uniform' },
    opacity: { type: 'number', is: 'uniform', default: 1.0 },
    tiling: { type: 'vec2', is: 'uniform', default: { x: 4, y: 4 } }
  },
  vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
  fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D src;
        uniform float opacity;
        uniform vec2 tiling;
        void main() {
            vec2 tiledUv = vUv * tiling;
            vec4 texColor = texture2D(src, tiledUv);
            float dist = distance(vUv, vec2(0.5, 0.5));
            float alpha = smoothstep(0.5, 0.2, dist);
            gl_FragColor = vec4(texColor.rgb, texColor.a * alpha * opacity);
        }
    `
});
