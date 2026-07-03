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
