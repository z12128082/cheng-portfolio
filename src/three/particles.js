import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uScatter;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  attribute vec3 positionB;
  attribute float seed;
  varying float vSeed;

  void main() {
    vSeed = seed;
    float m = smoothstep(0.0, 1.0, uMix);
    vec3 p = mix(position, positionB, m);
    float burst = sin(3.14159265 * m) * uScatter;
    p += vec3(
      sin(uTime * 0.6 + seed * 6.2832),
      cos(uTime * 0.5 + seed * 9.4248),
      sin(uTime * 0.7 + seed * 4.7124)
    ) * (0.018 + burst * (0.35 + seed * 0.65));
    vec3 away = p - uPointer;
    float d = length(away);
    p += (away / max(d, 0.0001)) * uPointerStrength * exp(-d * d * 1.8);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (320.0 / -mv.z) * (0.55 + seed * 0.9);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uColorMix;
  uniform float uOpacity;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.06, d) * uOpacity;
    vec3 color = mix(
      uColorA,
      uColorB,
      clamp(uColorMix + vSeed * 0.4 - 0.2, 0.0, 1.0)
    );
    gl_FragColor = vec4(color, alpha);
  }
`;

const smooth = (t) => t * t * (3 - 2 * t);

export class ParticleField {
  constructor(count) {
    this.count = count;
    this.shapes = new Map();
    this.mixValue = 1;
    this.mixSpeed = 0.7;
    this.targetName = null;

    const geometry = new THREE.BufferGeometry();
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    geometry.setAttribute(
      "positionB",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    this.uniforms = {
      uMix: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: 0.06 },
      uScatter: { value: 1.4 },
      uOpacity: { value: 0.8 },
      uPointer: { value: new THREE.Vector3(999, 999, 999) },
      uPointerStrength: { value: 0.32 },
      uColorA: { value: new THREE.Color("#6ee7ff") },
      uColorB: { value: new THREE.Color("#ff8a5c") },
      uColorMix: { value: 0.1 }
    };

    this.points = new THREE.Points(
      geometry,
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.points.frustumCulled = false;
  }

  registerShape(name, array) {
    this.shapes.set(name, array);
  }

  setInstant(name) {
    const target = this.shapes.get(name);
    if (!target) return;
    const geo = this.points.geometry;
    geo.attributes.position.array.set(target);
    geo.attributes.positionB.array.set(target);
    geo.attributes.position.needsUpdate = true;
    geo.attributes.positionB.needsUpdate = true;
    this.mixValue = 1;
    this.targetName = name;
  }

  morphTo(name, { duration = 1.6 } = {}) {
    if (name === this.targetName || !this.shapes.has(name)) return;
    const geo = this.points.geometry;
    const a = geo.attributes.position.array;
    const b = geo.attributes.positionB.array;
    const m = smooth(this.mixValue);
    for (let i = 0; i < a.length; i++) a[i] += (b[i] - a[i]) * m;
    b.set(this.shapes.get(name));
    geo.attributes.position.needsUpdate = true;
    geo.attributes.positionB.needsUpdate = true;
    this.mixValue = 0;
    this.mixSpeed = 1 / duration;
    this.targetName = name;
  }

  update(dt, time, ctx) {
    this.mixValue = Math.min(1, this.mixValue + dt * this.mixSpeed);
    this.uniforms.uMix.value = this.mixValue;
    this.uniforms.uTime.value = time;
    this.uniforms.uOpacity.value = 0.8 + ctx.pulseValue * 0.2;
    // transition spikes chromatic aberration
    ctx.holoPass.uniforms.uAberration.value =
      1.0 + Math.sin(Math.PI * this.mixValue) * 2.2 + ctx.pulseValue * 1.2;
    // pointer projected onto the z=0 structure plane
    const ray = new THREE.Vector3(ctx.pointer.x * 2, -ctx.pointer.y * 2, 0.5)
      .unproject(ctx.camera)
      .sub(ctx.camera.position)
      .normalize();
    const t = -ctx.camera.position.z / (ray.z || 0.0001);
    if (t > 0) {
      this.uniforms.uPointer.value
        .copy(ctx.camera.position)
        .addScaledVector(ray, t);
    }
  }
}
