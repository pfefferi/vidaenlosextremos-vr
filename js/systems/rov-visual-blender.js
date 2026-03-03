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
