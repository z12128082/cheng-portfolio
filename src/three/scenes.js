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
    const slab = edgesToLineSegments(
      boxEdges([center[0], 0, center[2]], size),
      "#6ee7ff",
      0.5
    );
    floorsGroup.add(slab);
    return slab;
  });
  const alertPositions = [
    [1.2, 0, 0.7],
    [-0.9, 1, -0.5],
    [0.4, 2, 0.9],
    [-1.3, 3, 0.3]
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
      new THREE.Float32BufferAttribute(
        new Array(alertPositions.length * 6).fill(0),
        3
      )
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
      Math.sin(a) * GAUGE.radius,
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
      [Math.cos(a) * inner, Math.sin(a) * inner, 0],
      [Math.cos(a) * outer, Math.sin(a) * outer, 0]
    ];
  });
  const ticks = edgesToLineSegments(tickEdges, "#6ee7ff", 0.4);
  ringGroup.add(ticks);
  const arcPoints = Array.from({ length: 97 }, (_, i) => {
    const a = -Math.PI * 0.75 + (i / 96) * Math.PI * 1.5;
    return new THREE.Vector3(
      Math.cos(a) * (GAUGE.radius - 0.32),
      Math.sin(a) * (GAUGE.radius - 0.32),
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
  // the whole gauge lives at the same height the particles use
  ringGroup.position.y = GAUGE.centerY;
  group.add(ringGroup);

  for (const g of [fabGroup, floorsGroup, ringGroup]) {
    g.traverse((node) => {
      if (node.material) {
        node.userData.baseOpacity = node.material.opacity || 0.5;
      }
    });
  }
  scanRect.userData.baseOpacity = 0.9;
  alerts.userData.baseOpacity = 0.9;
  links.userData.baseOpacity = 0.35;

  function setGroupOpacity(target, weight) {
    target.traverse((node) => {
      if (node.material) {
        node.material.opacity = node.userData.baseOpacity * weight;
      }
    });
  }

  const cyan = new THREE.Color("#6ee7ff");
  const orange = new THREE.Color("#ff8a5c");

  return {
    group,
    update(dt, time, ctx, weights) {
      // fab: scan loop rises through the building
      setGroupOpacity(fabGroup, weights.fab);
      const scanPhase = (time * 0.45) % 1;
      scanRect.position.y = scanPhase * 3.4;
      scanRect.material.opacity =
        weights.fab * 0.9 * Math.sin(Math.PI * scanPhase);
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
        cyan,
        orange,
        THREE.MathUtils.clamp((ctx.progress - 0.55) / 0.35, 0, 1)
      );
      arcMaterial.opacity = weights.ring * (0.7 + ctx.pulseValue * 0.3);
      ringGroup.visible = weights.ring > 0.01;
    }
  };
}
