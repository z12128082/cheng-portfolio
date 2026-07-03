import { test } from "node:test";
import assert from "node:assert/strict";
import {
  boxEdges,
  emblemPoints,
  fabPoints,
  floorsPoints,
  ringPoints,
  scatterPoints,
  wavePoints,
  GAUGE
} from "../src/three/shapes.js";

const COUNT = 4096;
const generators = {
  emblemPoints,
  fabPoints,
  floorsPoints,
  ringPoints,
  scatterPoints,
  wavePoints
};

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
