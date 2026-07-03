# Holographic Command Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把首頁 3D 重建為「全息科幻 HUD + GPU 粒子 morph」：固定全螢幕 WebGL 背景、開機序列、三幕全息場景、粒子 morph 轉場、攝影機 keyframe 運鏡、後製特效與互動。

**Architecture:** 舊的 wafer 場景（`app.js` 內約 1,500 行 Three.js 程式碼）整段移除，改為 `src/three/` 下五個模組：`stage.js`（renderer/composer/loop/整合門面）、`shapes.js`（純函式粒子目標點雲）、`particles.js`（GPU morph 粒子場）、`scenes.js`（各幕線框結構）、`camera-rig.js`（keyframe 運鏡＋拖曳環視）、`boot.js`（開機序列）。`app.js` 保留 i18n、scroll 章節、showcase、HUD，只透過小 API（`setScene`、`setPointer`、`pulse`…）驅動 stage。Canvas 從 film-stage 移出，變成 `position: fixed` 全頁背景。

**Tech Stack:** Vite 8、vanilla JS、three ^0.185（含 `three/examples/jsm/postprocessing`）、node:test（純函式單元測試，不新增依賴）。

## Global Constraints

- 不新增任何 npm 依賴（`three/examples` 屬於既有 three 套件）。
- 保留現有 scroll 章節結構（intro / wafer-drift / yield-constellation / prompt-fabric / approach）、scene snap、showcase 卡片、雙語 i18n、HUD 文案機制。
- Motion toggle 與 `prefers-reduced-motion`：關閉動態時停用 RAF 連續渲染與粒子動畫，只渲染靜態完成幀。
- 效能：pixel ratio 上限桌機 2 / 手機 1.5；粒子桌機 80,000 / 手機 25,000；`document.hidden` 時暫停 loop。
- 配色：深空底 `#05070d`、全息青 `#6ee7ff`、冰白 `#eaf6ff`、警示橘 `#ff8a5c`。
- 每個 task 結尾 `npm run build` 必須成功並 commit。
- 開機序列 3 秒內完成且任何滾動/點擊/按鍵立即快轉完成。

---

### Task 1: 粒子目標點雲產生器（純函式 + 單元測試）

**Files:**
- Create: `src/three/shapes.js`
- Test: `tests/shapes.test.mjs`

**Interfaces:**
- Produces（後續 task 依賴的精確簽名）:
  - `boxEdges(center: number[3], size: number[3]): Array<[number[3], number[3]]>` — 回傳 12 條邊的端點對
  - `FAB_LEVELS: Array<{center, size}>`、`FLOOR_SLABS: Array<{center, size}>` — 供 scenes.js 建線框結構共用
  - `fabPoints(count) / floorsPoints(count) / ringPoints(count) / scatterPoints(count, radius?) / wavePoints(count)`：皆回傳 `Float32Array`，長度恰為 `count * 3`
  - `GAUGE = { radius: 2.2, centerY: 1.6, ticks: 48 }`

- [ ] **Step 1: 先寫失敗測試**

```js
// tests/shapes.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  boxEdges,
  fabPoints,
  floorsPoints,
  ringPoints,
  scatterPoints,
  wavePoints,
  GAUGE
} from "../src/three/shapes.js";

const COUNT = 4096;
const generators = { fabPoints, floorsPoints, ringPoints, scatterPoints, wavePoints };

for (const [name, gen] of Object.entries(generators)) {
  test(`${name} returns exact count*3 finite floats`, () => {
    const out = gen(COUNT);
    assert.equal(out.length, COUNT * 3);
    for (let i = 0; i < out.length; i++) {
      assert.ok(Number.isFinite(out[i]), `${name}[${i}] is not finite`);
    }
  });
}

test("boxEdges returns 12 edges", () => {
  const edges = boxEdges([0, 0, 0], [2, 2, 2]);
  assert.equal(edges.length, 12);
  for (const [a, b] of edges) {
    assert.equal(a.length, 3);
    assert.equal(b.length, 3);
  }
});

test("ringPoints stays near the gauge ring plane", () => {
  const out = ringPoints(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const x = out[i * 3];
    const y = out[i * 3 + 1];
    const z = out[i * 3 + 2];
    const r = Math.hypot(x, y - GAUGE.centerY);
    assert.ok(r < GAUGE.radius + 0.8, "point outside gauge bounds");
    assert.ok(Math.abs(z) < 0.4, "gauge point drifted off plane");
  }
});

test("scatterPoints respects radius", () => {
  const out = scatterPoints(COUNT, 5);
  for (let i = 0; i < COUNT; i++) {
    assert.ok(Math.abs(out[i * 3]) <= 5.01);
  }
});
```

- [ ] **Step 2: 執行確認失敗**

Run: `node --test tests/shapes.test.mjs`
Expected: FAIL（`Cannot find module .../src/three/shapes.js`）

- [ ] **Step 3: 實作 shapes.js**

```js
// src/three/shapes.js
// Pure point-set generators for particle morph targets and shared
// structural dimensions. No three.js import — testable in Node.

export const GAUGE = { radius: 2.2, centerY: 1.6, ticks: 48 };

export const FAB_LEVELS = [
  { center: [0, 0.45, 0], size: [4.4, 0.9, 3.0] },
  { center: [-0.5, 1.25, 0], size: [3.2, 0.7, 2.6] },
  { center: [0.3, 1.95, 0.2], size: [2.2, 0.7, 1.8] },
  { center: [-0.2, 2.62, -0.2], size: [1.4, 0.65, 1.2] }
];

export const FLOOR_SLABS = [0, 1, 2, 3, 4].map((i) => ({
  center: [0, 0.4 + i * 0.62, 0],
  size: [3.6, 0.1, 2.6]
}));

export function boxEdges(center, size) {
  const [cx, cy, cz] = center;
  const [sx, sy, sz] = size;
  const x0 = cx - sx / 2, x1 = cx + sx / 2;
  const y0 = cy - sy / 2, y1 = cy + sy / 2;
  const z0 = cz - sz / 2, z1 = cz + sz / 2;
  const c = [
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]
  ];
  return [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ].map(([a, b]) => [c[a], c[b]]);
}

function fillFromEdges(edges, count, jitter = 0.02) {
  const out = new Float32Array(count * 3);
  const lengths = edges.map(([a, b]) =>
    Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  );
  const total = lengths.reduce((sum, l) => sum + l, 0) || 1;
  let i = 0;
  for (let e = 0; e < edges.length && i < count; e++) {
    const share = e === edges.length - 1
      ? count - i
      : Math.round((lengths[e] / total) * count);
    const [a, b] = edges[e];
    for (let k = 0; k < share && i < count; k++, i++) {
      const t = Math.random();
      out[i * 3] = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * jitter;
      out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * jitter;
      out[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + (Math.random() - 0.5) * jitter;
    }
  }
  for (; i < count; i++) {
    const src = (Math.floor(Math.random() * Math.max(1, i)) || 0) * 3;
    out[i * 3] = out[src];
    out[i * 3 + 1] = out[src + 1];
    out[i * 3 + 2] = out[src + 2];
  }
  return out;
}

export function fabPoints(count) {
  const edges = FAB_LEVELS.flatMap(({ center, size }) => boxEdges(center, size));
  edges.push([[-0.2, 2.95, -0.2], [-0.2, 3.6, -0.2]]); // antenna mast
  return fillFromEdges(edges, count);
}

export function floorsPoints(count) {
  const edges = FLOOR_SLABS.flatMap(({ center, size }) => boxEdges(center, size));
  return fillFromEdges(edges, count, 0.03);
}

export function ringPoints(count) {
  const { radius, centerY, ticks } = GAUGE;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    if (i % 6 === 0) {
      const tick = Math.floor(Math.random() * ticks);
      const a = (tick / ticks) * Math.PI * 2;
      const r = radius + 0.18 + Math.random() * 0.28;
      x = Math.cos(a) * r;
      y = centerY + Math.sin(a) * r;
      z = (Math.random() - 0.5) * 0.06;
    } else if (i % 6 === 1) {
      const a = -Math.PI * 0.75 + Math.random() * Math.PI * 1.35; // progress arc
      const r = radius - 0.32;
      x = Math.cos(a) * r;
      y = centerY + Math.sin(a) * r;
      z = (Math.random() - 0.5) * 0.06;
    } else {
      const a = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.09;
      x = Math.cos(a) * r;
      y = centerY + Math.sin(a) * r;
      z = (Math.random() - 0.5) * 0.12;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function scatterPoints(count, radius = 6.5) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = 1.2 + r * Math.cos(phi) * 0.45;
    out[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
  }
  return out;
}

export function wavePoints(count, width = 9, depth = 5) {
  const out = new Float32Array(count * 3);
  const cols = Math.max(2, Math.ceil(Math.sqrt(count * (width / depth))));
  const rows = Math.max(2, Math.ceil(count / cols));
  for (let i = 0; i < count; i++) {
    const cx = (i % cols) / (cols - 1) - 0.5;
    const cz = Math.floor(i / cols) / (rows - 1) - 0.5;
    out[i * 3] = cx * width;
    out[i * 3 + 1] = 0.7 + Math.sin(cx * 6.0) * Math.cos(cz * 4.0) * 0.35;
    out[i * 3 + 2] = cz * depth;
  }
  return out;
}
```

- [ ] **Step 4: 測試通過**

Run: `node --test tests/shapes.test.mjs`
Expected: PASS（8 tests）

- [ ] **Step 5: Commit**

```bash
git add src/three/shapes.js tests/shapes.test.mjs
git commit -m "feat: add particle morph target generators with tests"
```

---

### Task 2: Stage 引擎殼 + 舊 3D 移除 + Canvas 全頁化

**Files:**
- Create: `src/three/fx.js`、`src/three/stage.js`、`.claude/launch.json`
- Modify: `app.js`（移除舊 Three 系統、接上 stage）、`index.html`（canvas 移出 film-stage）、`styles.css`（fixed canvas、透明 stage 背景、新配色）

**Interfaces:**
- Produces:
  - `createStage({ canvas, reducedMotion }): Stage`
  - `Stage.start()` / `Stage.setScene(sceneId: string, progress: number)` / `Stage.setPointer(nx: number, ny: number)`（-0.5..0.5）/ `Stage.setReducedMotion(bool)` / `Stage.pulse()` / `Stage.registerFrameHook(fn(dt, time, ctx))`（Task 3-6 掛粒子/結構/運鏡/boot 用）
  - `Stage` 內部 ctx 物件：`{ scene, camera, renderer, composer, holoPass, sceneId, progress, pointer: {x, y}, pulseValue, reducedMotion, quality }`
  - `detectQuality(): { isMobile, pixelRatio, particleCount }`
- Consumes: 無（Task 1 的 shapes 尚未接上）

- [ ] **Step 1: 建立 fx.js（後製 shader）**

```js
// src/three/fx.js
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
```

- [ ] **Step 2: 建立 stage.js**

```js
// src/three/stage.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { HoloFXShader } from "./fx.js";

export function detectQuality() {
  const isMobile =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820;
  return {
    isMobile,
    pixelRatio: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
    particleCount: isMobile ? 25000 : 80000
  };
}

export function createStage({ canvas, reducedMotion }) {
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

  const frameHooks = [];
  const clock = new THREE.Clock();
  let rafId = 0;
  let staticDirty = true;

  function renderFrame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
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
      clock.getDelta();
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
    registerFrameHook(fn) {
      frameHooks.push(fn);
      if (ctx.reducedMotion) applyMode();
    }
  };
}
```

- [ ] **Step 3: index.html — canvas 移為全頁背景**

把 `<canvas id="hero-webgl" ...>` 從 `.film-stage` 內移除，改放在 `<body>` 第一個子元素（`.page-shell` 之前）：

```html
<body>
  <canvas id="hero-webgl" class="hero-webgl" aria-hidden="true"></canvas>
  <div class="page-shell">
```

- [ ] **Step 4: styles.css — fixed canvas 與透明 stage**

```css
.hero-webgl {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.page-shell {
  position: relative;
  z-index: 1;
}
```

並找到 `.film-stage` 的背景設定，把不透明背景改為半透明（保留邊框與圓角）：背景值改為 `rgba(8, 16, 23, 0.38)`（若原本是漸層則同步降低 alpha）。執行 `rg -n "film-stage" styles.css` 找到規則後調整。同時全域換色：

```bash
# 舊青綠 → 全息青、舊暖橘 → 警示橘（styles.css 內）
sed -i '' 's/#8cd4d8/#6ee7ff/g; s/#d7a07c/#ff8a5c/g' styles.css
```

- [ ] **Step 5: app.js — 移除舊 3D、接上 stage**

刪除：
- `import * as THREE from "three";` 改為 `import { createStage } from "./src/three/stage.js";`
- `visualDefaults`、`visual()`（100-159 行）
- `scenes` 陣列定義中所有 `camera / rootPosition / rootRotation / focusTarget / scale / scan / visual` 欄位——`scenes` 改為精簡骨架（HUD 文案仍由既有 `Object.assign` 迴圈補上，不動）：

```js
const scenes = [
  { id: "intro", shape: "scatter" },
  { id: "wafer-drift", shape: "fab" },
  { id: "yield-constellation", shape: "floors" },
  { id: "prompt-fabric", shape: "ring" },
  { id: "approach", shape: "wave" }
];
```

- 函式 `makeRadialTexture`、`setupThreeScene`、`resizeThreeScene`、`animateThreeScene`、`applyRootTransform` 整段刪除；`state.three` 欄位刪除。
- 檔尾 `window.addEventListener("resize", resizeThreeScene);` 與 `setupThreeScene();` 刪除，改為：

```js
stage = createStage({
  canvas: document.getElementById("hero-webgl"),
  reducedMotion: state.reducedMotion
});
setupEventListeners();
setStaticTranslations();
stage.start();
onScroll();
```

- `onScroll()` 尾端（`updateProductShowcases(chapterStates);` 之前）加：

```js
stage.setScene(state.activeSceneId, state.sceneProgress);
```

- pointermove listener 內加：

```js
stage.setPointer(
  event.clientX / window.innerWidth - 0.5,
  event.clientY / window.innerHeight - 0.5
);
```

- `setMotionPreference` 內加 `stage.setReducedMotion(state.reducedMotion);`
- `pulseSceneLock()` 內部改為呼叫 `stage.pulse()`（刪掉 `state.lockPulse` 相關行）。
- 注意 `stage` 常數在檔案後段才建立，`onScroll` / listener 會在 `stage` 初始化前定義但初始化後才觸發；為安全，`onScroll` 內用 `stage?.setScene(...)` 前置宣告 `let stage = null;` 於 `state` 定義後，檔尾賦值。

- [ ] **Step 6: 建立 .claude/launch.json**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "portfolio",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 4173
    }
  ]
}
```

- [ ] **Step 7: 驗證**

Run: `npm run build`
Expected: build 成功、無 unresolved import。
再啟動 dev server（preview 工具或 `npm run dev`）確認：頁面深空背景 + 發光網格地板全頁可見、opening 文字在其上、console 無錯誤、舊 wafer 場景消失。

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: replace wafer scene with full-page holographic stage shell"
```

---

### Task 3: GPU 粒子場與 morph 轉場

**Files:**
- Create: `src/three/particles.js`
- Modify: `app.js`（scene→shape 對應）、`src/three/stage.js`（掛入粒子場）

**Interfaces:**
- Consumes: Task 1 全部 generators、Task 2 `Stage.registerFrameHook` / `ctx`
- Produces:
  - `class ParticleField { constructor(count); points: THREE.Points; registerShape(name, Float32Array); morphTo(name, {duration=1.6}); setInstant(name); update(dt, time, ctx); }`
  - stage 增加 `attachParticles(field)`，並在 frame hook 中依 `ctx.sceneId` 找 `sceneShapeMap` morph——對應表由 app.js 傳入 `createStage({ ..., sceneShapes: { intro: "scatter", ... } })`

- [ ] **Step 1: 實作 particles.js**

```js
// src/three/particles.js
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
    // pointer projected onto z=0 plane
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
```

- [ ] **Step 2: stage.js 接粒子**

`createStage` 簽名改為 `createStage({ canvas, reducedMotion, sceneShapes })`，內部：

```js
import { ParticleField } from "./particles.js";
import {
  fabPoints, floorsPoints, ringPoints, scatterPoints, wavePoints
} from "./shapes.js";

// after composer setup:
const field = new ParticleField(quality.particleCount);
field.registerShape("scatter", scatterPoints(quality.particleCount));
field.registerShape("fab", fabPoints(quality.particleCount));
field.registerShape("floors", floorsPoints(quality.particleCount));
field.registerShape("ring", ringPoints(quality.particleCount));
field.registerShape("wave", wavePoints(quality.particleCount));
field.setInstant("scatter");
scene.add(field.points);
ctx.field = field;
```

並註冊內建 frame hook（在 frameHooks 執行前段）：

```js
frameHooks.push((dt, time, c) => {
  const shape = (sceneShapes || {})[c.sceneId];
  if (shape) field.morphTo(shape);
  field.update(dt, time, c);
});
```

`setScene` 不變（morph 由 hook 觸發）。reduced motion 的 `applyMode` settle 迴圈會讓 mix 直接跑滿，靜態幀即完成形體。

- [ ] **Step 3: app.js 傳入對應表**

```js
stage = createStage({
  canvas: document.getElementById("hero-webgl"),
  reducedMotion: state.reducedMotion,
  sceneShapes: Object.fromEntries(scenes.map((s) => [s.id, s.shape]))
});
```

- [ ] **Step 4: 驗證**

Run: `npm run build` → 成功。
Dev server 目視確認：載入即見青色粒子雲；滾動到 Project 01 粒子飛散重組成階梯狀廠房線框輪廓；到 02 變分層樓板；到 03 變垂直儀表環；滑鼠移動時粒子被推開留出尾流；轉場瞬間畫面色差微爆。回滾方向 morph 可逆。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add GPU particle field with scroll-driven shape morphing"
```

---

### Task 4: 三幕全息線框結構

**Files:**
- Create: `src/three/scenes.js`
- Modify: `src/three/stage.js`（掛入結構與權重）

**Interfaces:**
- Consumes: Task 1 `FAB_LEVELS / FLOOR_SLABS / GAUGE / boxEdges`、Task 2 hooks
- Produces: `createStructures(): { group: THREE.Group, update(dt, time, ctx, weights) }`，`weights = { fab, floors, ring }`（0..1，stage 計算並阻尼）

- [ ] **Step 1: 實作 scenes.js**

```js
// src/three/scenes.js
import * as THREE from "three";
import { FAB_LEVELS, FLOOR_SLABS, GAUGE, boxEdges } from "./shapes.js";

function edgesToLineSegments(edgeList, color, opacity) {
  const positions = [];
  for (const [a, b] of edgeList) positions.push(...a, ...b);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  return new THREE.LineSegments(geometry, material);
}

export function createStructures() {
  const group = new THREE.Group();

  // ── Scene 01: fab building + rising scan loop
  const fabGroup = new THREE.Group();
  const fabLines = edgesToLineSegments(
    FAB_LEVELS.flatMap(({ center, size }) => boxEdges(center, size)),
    "#6ee7ff",
    0.55
  );
  fabGroup.add(fabLines);
  const scanRect = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.4, 0, -1.7),
      new THREE.Vector3(2.4, 0, -1.7),
      new THREE.Vector3(2.4, 0, 1.7),
      new THREE.Vector3(-2.4, 0, 1.7)
    ]),
    new THREE.LineBasicMaterial({
      color: new THREE.Color("#eaf6ff"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  fabGroup.add(scanRect);
  group.add(fabGroup);

  // ── Scene 02: exploded floor slabs + alert points + link lines
  const floorsGroup = new THREE.Group();
  const slabMeshes = FLOOR_SLABS.map(({ center, size }) => {
    const slab = edgesToLineSegments(boxEdges([center[0], 0, center[2]], size), "#6ee7ff", 0.5);
    slab.userData.baseY = center[1];
    floorsGroup.add(slab);
    return slab;
  });
  const alertPositions = [
    [1.2, 0, 0.7], [-0.9, 1, -0.5], [0.4, 2, 0.9], [-1.3, 3, 0.3]
  ];
  const alertMaterial = new THREE.PointsMaterial({
    color: new THREE.Color("#ff8a5c"),
    size: 0.16,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const alerts = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(
      alertPositions.map(([x, , z]) => new THREE.Vector3(x, 0, z))
    ),
    alertMaterial
  );
  alerts.userData.slabIndex = alertPositions.map((p) => p[1]);
  floorsGroup.add(alerts);
  const linkMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#eaf6ff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const links = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Array(alertPositions.length * 6).fill(0), 3)
    ),
    linkMaterial
  );
  floorsGroup.add(links);
  group.add(floorsGroup);

  // ── Scene 03: gauge ring + ticks + progress arc
  const ringGroup = new THREE.Group();
  const circlePoints = Array.from({ length: 129 }, (_, i) => {
    const a = (i / 128) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(a) * GAUGE.radius,
      GAUGE.centerY + Math.sin(a) * GAUGE.radius,
      0
    );
  });
  const ringLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(circlePoints),
    new THREE.LineBasicMaterial({
      color: new THREE.Color("#6ee7ff"),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  ringGroup.add(ringLine);
  const tickEdges = Array.from({ length: GAUGE.ticks }, (_, i) => {
    const a = (i / GAUGE.ticks) * Math.PI * 2;
    const inner = GAUGE.radius + 0.14;
    const outer = GAUGE.radius + (i % 4 === 0 ? 0.42 : 0.26);
    return [
      [Math.cos(a) * inner, GAUGE.centerY + Math.sin(a) * inner, 0],
      [Math.cos(a) * outer, GAUGE.centerY + Math.sin(a) * outer, 0]
    ];
  });
  const ticks = edgesToLineSegments(tickEdges, "#6ee7ff", 0.4);
  ringGroup.add(ticks);
  const arcPoints = Array.from({ length: 97 }, (_, i) => {
    const a = -Math.PI * 0.75 + (i / 96) * Math.PI * 1.5;
    return new THREE.Vector3(
      Math.cos(a) * (GAUGE.radius - 0.32),
      GAUGE.centerY + Math.sin(a) * (GAUGE.radius - 0.32),
      0
    );
  });
  const arcMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#ff8a5c"),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(arcPoints),
    arcMaterial
  );
  ringGroup.add(arc);
  group.add(ringGroup);

  function setGroupOpacity(target, weight) {
    target.traverse((node) => {
      if (node.material) {
        node.material.opacity = node.userData.baseOpacity * weight;
      }
    });
  }
  for (const g of [fabGroup, floorsGroup, ringGroup]) {
    g.traverse((node) => {
      if (node.material) node.userData.baseOpacity = node.material.opacity || 0.5;
    });
  }
  // alerts/links/scan start at 0 but need a base for animation
  scanRect.userData.baseOpacity = 0.9;
  alertMaterial.userData = {};
  alerts.userData.baseOpacity = 0.9;
  links.userData.baseOpacity = 0.35;

  return {
    group,
    update(dt, time, ctx, weights) {
      // fab: scan loop rises 0 → 3.4, floors light up beneath it
      setGroupOpacity(fabGroup, weights.fab);
      const scanY = ((time * 0.45) % 1) * 3.4;
      scanRect.position.y = scanY;
      scanRect.material.opacity =
        weights.fab * 0.9 * (1 - Math.abs(((time * 0.45) % 1) - 0.5) * 0.6);
      fabGroup.visible = weights.fab > 0.01;

      // floors: explode separation follows scroll progress
      setGroupOpacity(floorsGroup, weights.floors);
      const separation = 0.62 + ctx.progress * 0.5;
      slabMeshes.forEach((slab, i) => {
        slab.position.y = 0.4 + i * separation;
      });
      const alertPos = alerts.geometry.attributes.position;
      const linkPos = links.geometry.attributes.position;
      alertPositions.forEach(([x, slabIndex, z], i) => {
        const y = 0.4 + slabIndex * separation + 0.1;
        alertPos.setXYZ(i, x, y, z);
        linkPos.setXYZ(i * 2, x, y, z);
        const next = alertPositions[(i + 1) % alertPositions.length];
        linkPos.setXYZ(
          i * 2 + 1,
          next[0],
          0.4 + next[1] * separation + 0.1,
          next[2]
        );
      });
      alertPos.needsUpdate = true;
      linkPos.needsUpdate = true;
      alertMaterial.opacity =
        weights.floors * (0.55 + Math.sin(time * 4.2) * 0.35);
      alertMaterial.size = 0.14 + Math.sin(time * 4.2) * 0.04;
      linkMaterial.opacity = weights.floors * 0.3;
      floorsGroup.visible = weights.floors > 0.01;

      // ring: slow rotation + progress arc draw range + overload color shift
      setGroupOpacity(ringGroup, weights.ring);
      ringGroup.rotation.z = time * 0.1;
      const arcCount = Math.floor(
        THREE.MathUtils.clamp(ctx.progress * 1.15, 0.02, 1) * 96
      );
      arc.geometry.setDrawRange(0, arcCount + 1);
      arcMaterial.color.lerpColors(
        new THREE.Color("#6ee7ff"),
        new THREE.Color("#ff8a5c"),
        THREE.MathUtils.clamp((ctx.progress - 0.55) / 0.35, 0, 1)
      );
      arcMaterial.opacity = weights.ring * (0.7 + ctx.pulseValue * 0.3);
      ringGroup.visible = weights.ring > 0.01;
    }
  };
}
```

- [ ] **Step 2: stage.js 掛入結構**

```js
import { createStructures } from "./scenes.js";

// after particle setup:
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
```

- [ ] **Step 3: 驗證**

Run: `npm run build` → 成功。
目視：Project 01 粒子廠房後面出現實線線框 + 白色掃描環由下而上循環；02 樓板隨滾動漸拉開、橘色警報點脈衝、層間連線；03 儀表環慢轉、進度弧隨滾動增長且尾段轉橘。切換場景時結構交叉淡入淡出無殘影。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add holographic structures for the three project scenes"
```

---

### Task 5: 攝影機運鏡（keyframe 路徑 + 拖曳環視 + 視差）

**Files:**
- Create: `src/three/camera-rig.js`
- Modify: `src/three/stage.js`（rig 接管相機）、`app.js`（拖曳事件）
- Test: `tests/camera-rig.test.mjs`

**Interfaces:**
- Consumes: Task 2 `ctx`
- Produces:
  - `class CameraRig { constructor(camera); samplePath(sceneId, t): { pos: THREE.Vector3, look: THREE.Vector3, fov: number }; update(dt, ctx); beginDrag(x); moveDrag(x, y); endDrag(); }`
  - stage 增加 `beginDrag/moveDrag/endDrag` 轉發方法

- [ ] **Step 1: 失敗測試**

```js
// tests/camera-rig.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { CameraRig, PATHS } from "../src/three/camera-rig.js";

test("samplePath returns finite pos/look/fov across all scenes", () => {
  const rig = new CameraRig(null);
  for (const sceneId of Object.keys(PATHS)) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const { pos, look, fov } = rig.samplePath(sceneId, t);
      for (const v of [pos.x, pos.y, pos.z, look.x, look.y, look.z, fov]) {
        assert.ok(Number.isFinite(v), `${sceneId}@${t} not finite`);
      }
      assert.ok(fov >= 25 && fov <= 50);
    }
  }
});

test("unknown scene falls back to intro path", () => {
  const rig = new CameraRig(null);
  const a = rig.samplePath("nope", 0.5);
  const b = rig.samplePath("intro", 0.5);
  assert.equal(a.fov, b.fov);
});
```

Run: `node --test tests/camera-rig.test.mjs` → FAIL（module not found）

- [ ] **Step 2: 實作 camera-rig.js**

```js
// src/three/camera-rig.js
import * as THREE from "three";

export const PATHS = {
  intro: {
    fov: [40, 38],
    pos: [[0, 3.4, 11.5], [0, 2.9, 10.2]],
    look: [[0, 1.4, 0], [0, 1.3, 0]]
  },
  "wafer-drift": {
    fov: [37, 30],
    pos: [[6.2, 4.6, 9.2], [2.4, 2.4, 6.6], [0.6, 1.5, 5.4]],
    look: [[0, 1.4, 0], [0, 1.3, 0], [-0.2, 1.6, 0]]
  },
  "yield-constellation": {
    fov: [34, 34],
    pos: [[-5.4, 2.2, 7.4], [-1.2, 2.9, 5.6], [2.4, 3.5, 6.4]],
    look: [[0, 1.5, 0], [0, 1.7, 0], [0, 1.9, 0]]
  },
  "prompt-fabric": {
    fov: [34, 41],
    pos: [[-3.6, 2.4, 5.8], [0.2, 1.9, 5.2], [3.4, 1.4, 4.4]],
    look: [[0, 1.6, 0], [0, 1.6, 0], [0, 1.6, 0]]
  },
  approach: {
    fov: [42, 44],
    pos: [[0, 2.8, 10.8], [0, 3.4, 12.0]],
    look: [[0, 1.5, 0], [0, 1.2, 0]]
  }
};

const toCurve = (list) =>
  new THREE.CatmullRomCurve3(
    list.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.4
  );

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.curves = new Map();
    this.currentPos = new THREE.Vector3(0, 3.4, 11.5);
    this.currentLook = new THREE.Vector3(0, 1.4, 0);
    this.currentFov = 40;
    this.orbit = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, dragging: false };
    this.dragStart = { x: 0, y: 0, yaw: 0, pitch: 0 };
  }

  getCurves(sceneId) {
    const id = PATHS[sceneId] ? sceneId : "intro";
    if (!this.curves.has(id)) {
      this.curves.set(id, {
        pos: toCurve(PATHS[id].pos),
        look: toCurve(PATHS[id].look),
        fov: PATHS[id].fov
      });
    }
    return this.curves.get(id);
  }

  samplePath(sceneId, t) {
    const { pos, look, fov } = this.getCurves(sceneId);
    const clamped = THREE.MathUtils.clamp(t, 0, 1);
    return {
      pos: pos.getPoint(clamped),
      look: look.getPoint(clamped),
      fov: THREE.MathUtils.lerp(fov[0], fov[1], clamped)
    };
  }

  beginDrag(x, y) {
    this.orbit.dragging = true;
    this.dragStart = {
      x, y,
      yaw: this.orbit.targetYaw,
      pitch: this.orbit.targetPitch
    };
  }

  moveDrag(x, y) {
    if (!this.orbit.dragging) return;
    const MAX = 0.26; // ±15°
    this.orbit.targetYaw = THREE.MathUtils.clamp(
      this.dragStart.yaw + (x - this.dragStart.x) * 0.003, -MAX, MAX
    );
    this.orbit.targetPitch = THREE.MathUtils.clamp(
      this.dragStart.pitch + (y - this.dragStart.y) * 0.002, -MAX * 0.6, MAX * 0.6
    );
  }

  endDrag() {
    this.orbit.dragging = false;
    this.orbit.targetYaw = 0;
    this.orbit.targetPitch = 0; // spring back
  }

  update(dt, ctx) {
    const target = this.samplePath(ctx.sceneId, ctx.progress);
    const lambda = 2.6;
    this.currentPos.x = THREE.MathUtils.damp(this.currentPos.x, target.pos.x, lambda, dt);
    this.currentPos.y = THREE.MathUtils.damp(this.currentPos.y, target.pos.y, lambda, dt);
    this.currentPos.z = THREE.MathUtils.damp(this.currentPos.z, target.pos.z, lambda, dt);
    this.currentLook.x = THREE.MathUtils.damp(this.currentLook.x, target.look.x, lambda, dt);
    this.currentLook.y = THREE.MathUtils.damp(this.currentLook.y, target.look.y, lambda, dt);
    this.currentLook.z = THREE.MathUtils.damp(this.currentLook.z, target.look.z, lambda, dt);
    this.currentFov = THREE.MathUtils.damp(this.currentFov, target.fov, lambda, dt);

    this.orbit.yaw = THREE.MathUtils.damp(this.orbit.yaw, this.orbit.targetYaw, 5, dt);
    this.orbit.pitch = THREE.MathUtils.damp(this.orbit.pitch, this.orbit.targetPitch, 5, dt);

    if (!this.camera) return;
    const offset = this.currentPos.clone().sub(this.currentLook);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.orbit.yaw);
    offset.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.orbit.pitch);
    const parallaxX = ctx.pointer.x * 0.5;
    const parallaxY = ctx.pointer.y * -0.3;
    this.camera.position.copy(this.currentLook).add(offset);
    this.camera.position.x += parallaxX;
    this.camera.position.y += parallaxY;
    this.camera.lookAt(
      this.currentLook.x + ctx.pointer.x * 0.2,
      this.currentLook.y + ctx.pointer.y * -0.12,
      this.currentLook.z
    );
    const fovKick = Math.sin(Math.PI * (ctx.field ? ctx.field.mixValue : 1)) * 2.4;
    this.camera.fov = this.currentFov + fovKick + ctx.pulseValue * 1.2;
    this.camera.rotation.z += this.orbit.yaw * 0.12;
    this.camera.updateProjectionMatrix();
  }
}
```

- [ ] **Step 3: 測試通過**

Run: `node --test tests/camera-rig.test.mjs` → PASS

- [ ] **Step 4: stage.js 接 rig 與拖曳 API**

```js
import { CameraRig } from "./camera-rig.js";

const rig = new CameraRig(camera);
frameHooks.push((dt, time, c) => rig.update(dt, c));
// return 物件加：
beginDrag: (x, y) => rig.beginDrag(x, y),
moveDrag: (x, y) => rig.moveDrag(x, y),
endDrag: () => rig.endDrag(),
```

- [ ] **Step 5: app.js 拖曳事件（不干擾連結/按鈕/選字）**

```js
window.addEventListener("pointerdown", (event) => {
  if (event.target.closest("a, button, input, .showcase-card")) return;
  stage.beginDrag(event.clientX, event.clientY);
});
window.addEventListener("pointermove", (event) => {
  stage.moveDrag(event.clientX, event.clientY);
});
window.addEventListener("pointerup", () => stage.endDrag());
window.addEventListener("pointercancel", () => stage.endDrag());
```

觸控裝置停用（避免與滾動衝突）：在 pointerdown handler 開頭 `if (event.pointerType === "touch") return;`

- [ ] **Step 6: 驗證**

`npm run build` 成功。目視：滾進 Project 01 攝影機從高空俯衝貼近廠房；02 橫向掃過樓板；03 繞儀表環半圈同時 FOV 微開；morph 轉場瞬間有 FOV kick。空白處按住拖曳可小幅環視、放開回彈；在連結上拖曳不觸發。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add keyframe camera rig with drag orbit and parallax"
```

---

### Task 6: 開機序列（Boot Sequence）

**Files:**
- Create: `src/three/boot.js`
- Modify: `src/three/stage.js`（textPoints 註冊 + boot API）、`app.js`（啟動 boot）、`styles.css`（`is-booting/is-booted` 轉場）、`index.html`（body class 起始值）

**Interfaces:**
- Consumes: Task 3 `ParticleField.morphTo/registerShape`、stage `ctx`
- Produces: `runBoot({ stage, reducedMotion, onDone })` — 完成時把 `body.is-booting` 換成 `is-booted`

- [ ] **Step 1: 實作 boot.js**

```js
// src/three/boot.js

export function sampleTextPoints(count, lines, worldWidth = 7.4) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 220;
  const ctx2d = canvas.getContext("2d");
  ctx2d.fillStyle = "#fff";
  ctx2d.font = "900 88px 'Helvetica Neue', 'Arial Black', sans-serif";
  ctx2d.textAlign = "center";
  ctx2d.textBaseline = "middle";
  lines.forEach((line, i) => ctx2d.fillText(line, 320, 64 + i * 92));
  const data = ctx2d.getImageData(0, 0, 640, 220).data;
  const candidates = [];
  for (let y = 0; y < 220; y += 2) {
    for (let x = 0; x < 640; x += 2) {
      if (data[(y * 640 + x) * 4 + 3] > 128) candidates.push([x, y]);
    }
  }
  const out = new Float32Array(count * 3);
  const scale = worldWidth / 640;
  for (let i = 0; i < count; i++) {
    const [x, y] = candidates.length
      ? candidates[(Math.random() * candidates.length) | 0]
      : [320, 110];
    out[i * 3] = (x - 320) * scale;
    out[i * 3 + 1] = 2.3 - (y - 110) * scale;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
  }
  return out;
}

export function runBoot({ stage, reducedMotion, onDone }) {
  const body = document.body;
  const finish = () => {
    body.classList.remove("is-booting");
    body.classList.add("is-booted");
    stage.endBoot();
    if (onDone) onDone();
  };

  if (reducedMotion) {
    finish();
    return;
  }

  body.classList.add("is-booting");
  let finished = false;
  const timers = [];
  const done = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    removeSkips();
    finish();
  };
  const skip = () => done();
  const skipEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
  const removeSkips = () =>
    skipEvents.forEach((e) => window.removeEventListener(e, skip));
  skipEvents.forEach((e) =>
    window.addEventListener(e, skip, { passive: true, once: false })
  );

  stage.beginBoot(); // grid dark → sweep in
  timers.push(setTimeout(() => stage.bootShowText(), 700));
  timers.push(setTimeout(done, 2800));
}
```

- [ ] **Step 2: stage.js 增加 boot API**

```js
import { sampleTextPoints } from "./boot.js"; // 只在瀏覽器呼叫

// createStage 內：
let bootActive = false;
let gridTarget = 0.14;

// frameHooks 前段加 grid 呼吸 hook：
frameHooks.push((dt) => {
  grid.material.opacity = THREE.MathUtils.damp(
    grid.material.opacity, bootActive ? 0.3 : gridTarget, 2.4, dt
  );
});

// return 物件加：
beginBoot() {
  bootActive = true;
  grid.material.opacity = 0;
  field.registerShape(
    "bootText",
    sampleTextPoints(quality.particleCount, ["CHENG", "PORTFOLIO"])
  );
  field.setInstant("scatter");
},
bootShowText() {
  field.morphTo("bootText", { duration: 1.1 });
},
endBoot() {
  bootActive = false;
  field.morphTo((sceneShapes || {})[ctx.sceneId] || "scatter", { duration: 1.3 });
},
```

同時把 Task 3 的 morph hook 加上 boot 防護：`if (bootActive) return;` 於 `field.morphTo(shape)` 前。

- [ ] **Step 3: app.js 啟動 boot**

檔尾初始化改為：

```js
import { runBoot } from "./src/three/boot.js";

setupEventListeners();
setStaticTranslations();
stage.start();
onScroll();
runBoot({ stage, reducedMotion: state.reducedMotion });
```

- [ ] **Step 4: CSS 開機轉場**

`index.html` 的 `<body>` 不加 class（JS 控制，無 JS 時內容照常顯示）。styles.css 加：

```css
body.is-booting .site-header,
body.is-booting .opening-copy {
  opacity: 0;
  transform: translateY(14px);
}

.site-header,
.opening-copy {
  transition: opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s;
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .opening-copy {
    transition: none;
  }
}
```

- [ ] **Step 5: 驗證**

`npm run build` 成功。目視（重新整理頁面）：暗場 → 網格亮起 → 粒子在 0.7 秒後聚合成 CHENG / PORTFOLIO 字樣 → 2.8 秒後粒子釋放回散布雲、header 與 opening 文案淡入。載入後立刻滾動 → 序列立即中止並顯示完成狀態。開 motion toggle（降低動態）重整 → 無序列直接完成態。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add particle boot sequence with skip and reduced-motion path"
```

---

### Task 7: 互動打磨（showcase 連動、HUD 配色、細節）

**Files:**
- Modify: `app.js`（showcase hover → pulse）、`styles.css`（HUD/stage chrome 適配新視覺）

**Interfaces:**
- Consumes: `stage.pulse()`（Task 2）

- [ ] **Step 1: showcase hover 連動**

`app.js` `setupEventListeners()` 內加：

```js
productShowcases.forEach((showcase) => {
  showcase.addEventListener("pointerenter", () => stage.pulse());
});
```

（`stage.pulse()` 已驅動粒子透明度、色差與 FOV 微爆，形成卡片↔3D 呼應。）

- [ ] **Step 2: HUD/stage chrome 微調**

styles.css：
- `.film-hud`、`.stage-chrome` 文字與框線色統一改用 `#6ee7ff` 系（已由 Task 2 sed 換色，這裡檢查遺漏的 rgba 寫法：`rg -n "140, 212, 216|215, 160, 124" styles.css`，將 `140, 212, 216` → `110, 231, 255`、`215, 160, 124` → `255, 138, 92`）。
- `.film-vignette`、`.film-shadow` 若完全遮蔽背景 3D，降低其不透明度（各規則 alpha 上限 0.45）。

- [ ] **Step 3: 驗證**

`npm run build` 成功。目視：hover showcase 卡片時 3D 輕微脈衝；HUD 色系一致無舊青綠殘留；vignette 不會蓋死背景。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire showcase hover pulse and align HUD palette"
```

---

### Task 8: 效能與無障礙驗收

**Files:**
- Modify: 視驗收結果微調 `src/three/*.js` 參數

- [ ] **Step 1: 桌機驗證**

Dev server 目視 + console 無錯誤 + `preview_resize` desktop（1280×800）滾完整頁：morph 全程順暢無卡頓、無 WebGL warning。

- [ ] **Step 2: 手機驗證**

`preview_resize` mobile（375×812）重載：粒子數降為 25,000（console 加暫時 log 或以 `detectQuality()` 行為推斷）、頁面可正常滾動、拖曳環視不觸發（touch 直接 return）、幀率目視流暢。

- [ ] **Step 3: Reduced motion 驗證**

切換 motion toggle → 畫面停在靜態完成幀（粒子成形、無動畫）、CPU 使用率下降（無連續 RAF）。切回 → 動畫恢復。

- [ ] **Step 4: 回歸驗證**

- 語言切換 zh/EN：HUD、章節、showcase 文案正常。
- scroll snap 與 showcase 步驟 rail 行為與改版前一致。
- `node --test tests/` 全綠、`npm run build` 成功。

- [ ] **Step 5: 修正發現的問題並 Commit**

```bash
git add -A
git commit -m "chore: performance and accessibility tuning for holographic stage"
```
