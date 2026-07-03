export const HoloFXShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 1.0 },
    uGrain: { value: 0.045 },
    uVignette: { value: 0.5 },
    uScanline: { value: 0.05 }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uScanline;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 centered = vUv - 0.5;
      float r2 = dot(centered, centered);
      vec2 shift = centered * r2 * 0.014 * uAberration;
      float cr = texture2D(tDiffuse, vUv + shift).r;
      vec4 base = texture2D(tDiffuse, vUv);
      float cb = texture2D(tDiffuse, vUv - shift).b;
      vec3 color = vec3(cr, base.g, cb);
      float scan = sin(vUv.y * 860.0) * 0.5 + 0.5;
      color *= 1.0 - scan * uScanline;
      color += (hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 43.0) - 0.5) * uGrain;
      float vig = smoothstep(0.9, 0.2, r2 * (1.0 + uVignette * 1.6));
      color *= mix(1.0, vig, uVignette);
      gl_FragColor = vec4(color, base.a);
    }
  `
};
