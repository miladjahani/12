import * as THREE from 'three';
import { Pad, Terrain } from '../types';

export const generatePadGeometry = (pad: Pad, allPads: Pad[], terrain: Terrain) => {
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;
  const slope_ratio = 1 / Math.tan((pad.slopeDeg * Math.PI) / 180);

  const getAdjacentPads = (p: Pad, pads: Pad[]) => {
    const epsilon = 0.1;
    return {
      left: pads.find(
        (x) =>
          x.id !== p.id &&
          x.lift === p.lift &&
          Math.abs(x.x + x.L - p.x) < epsilon &&
          Math.abs(x.z - p.z) < epsilon
      ),
      right: pads.find(
        (x) =>
          x.id !== p.id &&
          x.lift === p.lift &&
          Math.abs(x.x - (p.x + p.L)) < epsilon &&
          Math.abs(x.z - p.z) < epsilon
      ),
      front: pads.find(
        (x) =>
          x.id !== p.id &&
          x.lift === p.lift &&
          Math.abs(x.z - (p.z + p.W)) < epsilon &&
          Math.abs(x.x - p.x) < epsilon
      ),
      back: pads.find(
        (x) =>
          x.id !== p.id &&
          x.lift === p.lift &&
          Math.abs(x.z + x.W - p.z) < epsilon &&
          Math.abs(x.x - p.x) < epsilon
      ),
    };
  };

  const adj = getAdjacentPads(pad, allPads);
  const getBaseY = (x: number, z: number) => x * sx + z * sy + (pad.lift - 1) * pad.H;

  const c = [
    { x: -pad.L / 2, z: -pad.W / 2 }, // TL
    { x: pad.L / 2, z: -pad.W / 2 },  // TR
    { x: pad.L / 2, z: pad.W / 2 },   // BR
    { x: -pad.L / 2, z: pad.W / 2 },  // BL
  ];

  const h = c.map((pt) => pad.H - ( (pad.x + pt.x) * sx + (pad.z + pt.z) * sy ));

  const getRun = (hVal: number, type: string, hasAdj: boolean) => {
    if (type === 'wall') return 0;
    return hVal * slope_ratio * (type === 'attach' && hasAdj ? 0.5 : 1);
  };

  const runs = [
    getRun(h[0], pad.bounds.B, !!adj.back),
    getRun(h[1], pad.bounds.B, !!adj.back),
    getRun(h[2], pad.bounds.F, !!adj.front),
    getRun(h[3], pad.bounds.F, !!adj.front),
  ];

  const t = [
    { x: c[0].x + getRun(h[0], pad.bounds.L, !!adj.left), z: c[0].z + runs[0] },
    { x: c[1].x - getRun(h[1], pad.bounds.R, !!adj.right), z: c[1].z + runs[1] },
    { x: c[2].x - getRun(h[2], pad.bounds.R, !!adj.right), z: c[2].z - runs[2] },
    { x: c[3].x + getRun(h[3], pad.bounds.L, !!adj.left), z: c[3].z - runs[3] },
  ];

  const vB = c.map((pt) => new THREE.Vector3(pad.x + pt.x, getBaseY(pad.x + pt.x, pad.z + pt.z), pad.z + pt.z));
  const vT = t.map((pt) => new THREE.Vector3(pad.x + pt.x, getBaseY(pad.x + pt.x, pad.z + pt.z) + pad.H, pad.z + pt.z));

  const oreVertices: number[] = [];
  const sides = [[0, 1, 1, 0], [1, 2, 2, 1], [2, 3, 3, 2], [3, 0, 0, 3]];

  sides.forEach((s) => {
    // Triangle 1
    oreVertices.push(vB[s[0]].x, vB[s[0]].y, vB[s[0]].z);
    oreVertices.push(vB[s[1]].x, vB[s[1]].y, vB[s[1]].z);
    oreVertices.push(vT[s[2]].x, vT[s[2]].y, vT[s[2]].z);
    // Triangle 2
    oreVertices.push(vB[s[0]].x, vB[s[0]].y, vB[s[0]].z);
    oreVertices.push(vT[s[2]].x, vT[s[2]].y, vT[s[2]].z);
    oreVertices.push(vT[s[3]].x, vT[s[3]].y, vT[s[3]].z);
  });

  // Top surface
  oreVertices.push(vT[0].x, vT[0].y, vT[0].z);
  oreVertices.push(vT[1].x, vT[1].y, vT[1].z);
  oreVertices.push(vT[2].x, vT[2].y, vT[2].z);
  oreVertices.push(vT[0].x, vT[0].y, vT[0].z);
  oreVertices.push(vT[2].x, vT[2].y, vT[2].z);
  oreVertices.push(vT[3].x, vT[3].y, vT[3].z);

  return {
    oreVertices: new Float32Array(oreVertices),
    vT,
    vB
  };
};
