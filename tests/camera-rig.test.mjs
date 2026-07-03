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
