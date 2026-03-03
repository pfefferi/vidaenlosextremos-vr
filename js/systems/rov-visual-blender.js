/* global AFRAME */
/**
 * Custom Shader for Visual Continuity
 * Blends a tiled texture with a radial alpha falloff to hide geometric seams.
 */
AFRAME.registerShader('radial-blend', {
    schema: {
        src: { type: 'map', is: 'uniform' },
        opacity: { type: 'number', is: 'uniform', default: 1.0 },
        tiling: { type: 'vec2', is: 'uniform', default: { x: 4, y: 4 } },
        offset: { type: 'vec2', is: 'uniform', default: { x: 0, y: 0 } }
    },

    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

    fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D src;
    uniform float opacity;
    uniform vec2 tiling;
    uniform vec2 offset;

    void main() {
      // Calculate tiled UVs with offset
      vec2 tiledUv = (vUv * tiling) + offset;
      vec4 texColor = texture2D(src, tiledUv);
      
      // Calculate distance from the center (0.5, 0.5)
      float dist = distance(vUv, vec2(0.5, 0.5));
      
      // Radial alpha falloff: 1 at 0.0 distance, 0 at 0.5 distance (edge of circle)
      // smoothing between 0.2 and 0.5 for a soft blend
      float alpha = smoothstep(0.5, 0.2, dist);
      
      // Final color with alpha blending
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha * opacity);
    }
  `
});
