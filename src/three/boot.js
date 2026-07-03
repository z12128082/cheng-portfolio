export function sampleTextPoints(
  count,
  lines,
  { worldWidth = 7.4, centerX = 0, centerY = 2.15 } = {}
) {
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
    out[i * 3] = centerX + (x - 320) * scale;
    out[i * 3 + 1] = centerY - (y - 110) * scale;
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

  // Skip the sequence when motion is reduced or the page was restored
  // mid-scroll (the opening headline is not on screen there).
  if (reducedMotion || window.scrollY > window.innerHeight * 0.4) {
    finish();
    return;
  }

  body.classList.add("is-booting");
  let finished = false;
  const timers = [];
  const skipEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
  const done = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    skipEvents.forEach((e) => window.removeEventListener(e, done));
    finish();
  };
  skipEvents.forEach((e) =>
    window.addEventListener(e, done, { passive: true })
  );

  stage.beginBoot();
  timers.push(window.setTimeout(() => stage.bootShowText(), 700));
  timers.push(window.setTimeout(done, 2800));
}
