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
    this.orbit = {
      yaw: 0,
      pitch: 0,
      targetYaw: 0,
      targetPitch: 0,
      dragging: false
    };
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
      x,
      y,
      yaw: this.orbit.targetYaw,
      pitch: this.orbit.targetPitch
    };
  }

  moveDrag(x, y) {
    if (!this.orbit.dragging) return;
    const MAX = 0.26; // ±15°
    this.orbit.targetYaw = THREE.MathUtils.clamp(
      this.dragStart.yaw + (x - this.dragStart.x) * 0.003,
      -MAX,
      MAX
    );
    this.orbit.targetPitch = THREE.MathUtils.clamp(
      this.dragStart.pitch + (y - this.dragStart.y) * 0.002,
      -MAX * 0.6,
      MAX * 0.6
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
    // paths are tuned for landscape; pull back on narrow/portrait screens
    // so structures stay fully framed
    const aspect = this.camera.aspect || 1.78;
    const pullback = THREE.MathUtils.clamp(
      Math.pow(1 / Math.min(aspect, 1), 0.75),
      1,
      2
    );
    offset.multiplyScalar(pullback);
    this.camera.position.copy(this.currentLook).add(offset);
    this.camera.position.x += ctx.pointer.x * 0.5;
    this.camera.position.y += ctx.pointer.y * -0.3;
    this.camera.lookAt(
      this.currentLook.x + ctx.pointer.x * 0.2,
      this.currentLook.y + ctx.pointer.y * -0.12,
      this.currentLook.z
    );
    const fovKick = Math.sin(Math.PI * (ctx.field ? ctx.field.mixValue : 1)) * 2.4;
    const portraitFov = (1 - Math.min(aspect, 1)) * 6;
    this.camera.fov = this.currentFov + fovKick + portraitFov + ctx.pulseValue * 1.2;
    this.camera.rotation.z += this.orbit.yaw * 0.12;
    this.camera.updateProjectionMatrix();
  }
}
