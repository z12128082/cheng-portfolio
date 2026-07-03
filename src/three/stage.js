import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { HoloFXShader } from "./fx.js";
import { ParticleField } from "./particles.js";
import {
  emblemPoints,
  fabPoints,
  floorsPoints,
  ringPoints,
  scatterPoints
} from "./shapes.js";
import { createStructures } from "./scenes.js";
import { CameraRig } from "./camera-rig.js";
import { sampleTextPoints } from "./boot.js";

export function detectQuality() {
  const isMobile =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820;
  return {
    isMobile,
    pixelRatio: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
    particleCount: isMobile ? 25000 : 80000
  };
}

export function createStage({ canvas, reducedMotion, sceneShapes }) {
  const quality = detectQuality();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !quality.isMobile,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#05070d");
  scene.fog = new THREE.FogExp2(new THREE.Color("#05070d"), 0.032);

  const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.set(0, 3.2, 11);
  camera.lookAt(0, 1.3, 0);

  const grid = new THREE.GridHelper(36, 72, 0x6ee7ff, 0x18384a);
  grid.material.transparent = true;
  grid.material.opacity = 0.14;
  grid.material.depthWrite = false;
  scene.add(grid);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    quality.isMobile ? 0.55 : 0.85,
    0.7,
    0.52
  );
  composer.addPass(bloom);
  const holoPass = new ShaderPass(HoloFXShader);
  composer.addPass(holoPass);
  composer.addPass(new OutputPass());

  const ctx = {
    scene,
    camera,
    renderer,
    composer,
    holoPass,
    bloom,
    grid,
    quality,
    sceneId: "intro",
    progress: 0,
    pointer: { x: 0, y: 0 },
    pulseValue: 0,
    reducedMotion: Boolean(reducedMotion)
  };

  const field = new ParticleField(quality.particleCount);
  field.registerShape("scatter", scatterPoints(quality.particleCount));
  field.registerShape("fab", fabPoints(quality.particleCount));
  field.registerShape("floors", floorsPoints(quality.particleCount));
  field.registerShape("ring", ringPoints(quality.particleCount));
  field.registerShape("emblem", emblemPoints(quality.particleCount));
  field.setInstant("scatter");
  scene.add(field.points);
  ctx.field = field;

  const frameHooks = [];
  let rafId = 0;
  let lastTime = performance.now();
  let elapsed = 0;

  let bootActive = false;

  frameHooks.push((dt, time, c) => {
    if (!bootActive) {
      const shape = (sceneShapes || {})[c.sceneId];
      if (shape) field.morphTo(shape);
    }
    field.update(dt, time, c);
  });

  frameHooks.push((dt) => {
    grid.material.opacity = THREE.MathUtils.damp(
      grid.material.opacity,
      bootActive ? 0.3 : 0.14,
      2.4,
      dt
    );
  });

  const structures = createStructures();
  scene.add(structures.group);
  const weights = { fab: 0, floors: 0, ring: 0 };
  const weightTargets = {
    "wafer-drift": "fab",
    "yield-constellation": "floors",
    "prompt-fabric": "ring"
  };
  frameHooks.push((dt, time, c) => {
    for (const key of Object.keys(weights)) {
      const target = weightTargets[c.sceneId] === key ? 1 : 0;
      weights[key] = THREE.MathUtils.damp(weights[key], target, 3.2, dt);
    }
    structures.update(dt, time, c, weights);
  });

  const rig = new CameraRig(camera);
  frameHooks.push((dt, time, c) => rig.update(dt, c));

  function renderFrame() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;
    const time = elapsed;
    ctx.pulseValue = Math.max(0, ctx.pulseValue - dt * 1.6);
    holoPass.uniforms.uTime.value = time;
    for (const hook of frameHooks) hook(dt, time, ctx);
    composer.render();
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    renderFrame();
  }

  function stopLoop() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function applyMode() {
    stopLoop();
    if (ctx.reducedMotion) {
      // settle hooks then render one static frame
      for (let i = 0; i < 90; i++) {
        for (const hook of frameHooks) hook(1 / 60, 0, ctx);
      }
      holoPass.uniforms.uTime.value = 0;
      composer.render();
    } else if (!document.hidden) {
      lastTime = performance.now();
      loop();
    }
  }

  document.addEventListener("visibilitychange", applyMode);

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    if (ctx.reducedMotion) applyMode();
  });

  return {
    ctx,
    start: applyMode,
    setScene(sceneId, progress) {
      const changed = ctx.sceneId !== sceneId;
      ctx.sceneId = sceneId;
      ctx.progress = progress;
      if (changed && ctx.reducedMotion) applyMode();
    },
    setPointer(nx, ny) {
      ctx.pointer.x = nx;
      ctx.pointer.y = ny;
    },
    setReducedMotion(value) {
      ctx.reducedMotion = Boolean(value);
      applyMode();
    },
    pulse() {
      ctx.pulseValue = 1;
    },
    beginBoot() {
      bootActive = true;
      grid.material.opacity = 0;
      // align the particle text with where the DOM headline will appear:
      // lower-left on wide screens, centered on portrait
      const wide = camera.aspect > 1.05;
      field.registerShape(
        "bootText",
        sampleTextPoints(
          quality.particleCount,
          ["CHENG", "PORTFOLIO"],
          wide
            ? { worldWidth: 5.6, centerX: -1.7, centerY: 1.5 }
            : { worldWidth: 6.2, centerX: 0, centerY: 2.05 }
        )
      );
      field.setInstant("scatter");
    },
    bootShowText() {
      field.morphTo("bootText", { duration: 1.1 });
    },
    endBoot() {
      bootActive = false;
      field.morphTo((sceneShapes || {})[ctx.sceneId] || "scatter", {
        duration: 1.3
      });
    },
    beginDrag: (x, y) => rig.beginDrag(x, y),
    moveDrag: (x, y) => rig.moveDrag(x, y),
    endDrag: () => rig.endDrag(),
    registerFrameHook(fn) {
      frameHooks.push(fn);
      if (ctx.reducedMotion) applyMode();
    }
  };
}
