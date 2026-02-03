import * as THREE from 'three';
import { Pad, Terrain, getAdjacentPads } from './heapCalculations';

export const generatePadGeometry = (pad: Pad, terrain: Terrain, allPads: Pad[]) => {
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;
  const slopeRatio = 1 / Math.tan((pad.slopeDeg * Math.PI) / 180);
  const adjacent = getAdjacentPads(pad, allPads);

  const getBaseY = (gx: number, gz: number) => (gx * sx) + (gz * sy) + (pad.lift - 1) * pad.H;

  const c = [
    { x: -pad.L / 2, z: -pad.W / 2 }, // Back-Left (BL)
    { x: pad.L / 2, z: -pad.W / 2 },  // Back-Right (BR)
    { x: pad.L / 2, z: pad.W / 2 },   // Front-Right (FR)
    { x: -pad.L / 2, z: pad.W / 2 }   // Front-Left (FL)
  ];

  const getRun = (h: number, type: 'free' | 'wall' | 'attach', hasAdj: boolean) => {
    if (type === 'wall') return 0;
    if (type === 'attach' && hasAdj) return h * slopeRatio * 0.5;
    return h * slopeRatio;
  };

  const h = c.map(pt => pad.H - ((pad.x + pt.x) * sx + (pad.z + pt.z) * sy));

  const runB = [getRun(h[0], pad.bounds.B, !!adjacent.back), getRun(h[1], pad.bounds.B, !!adjacent.back)];
  const runF = [getRun(h[3], pad.bounds.F, !!adjacent.front), getRun(h[2], pad.bounds.F, !!adjacent.front)];
  const runL = [getRun(h[0], pad.bounds.L, !!adjacent.left), getRun(h[3], pad.bounds.L, !!adjacent.left)];
  const runR = [getRun(h[1], pad.bounds.R, !!adjacent.right), getRun(h[2], pad.bounds.R, !!adjacent.right)];

  const t = [
    { x: c[0].x + runL[0], z: c[0].z + runB[0] },
    { x: c[1].x - runR[0], z: c[1].z + runB[1] },
    { x: c[2].x - runR[1], z: c[2].z - runF[1] },
    { x: c[3].x + runL[1], z: c[3].z - runF[0] }
  ];

  const vB = c.map(pt => new THREE.Vector3(pad.x + pt.x, getBaseY(pad.x + pt.x, pad.z + pt.z), pad.z + pt.z));
  const vT = t.map(pt => new THREE.Vector3(pad.x + pt.x, getBaseY(pad.x + pt.x, pad.z + pt.z) + pad.H, pad.z + pt.z));

  const oreVertices: number[] = [];
  // Sides: BL-BR, BR-FR, FR-FL, FL-BL
  const sides = [[0, 1, 1, 0], [1, 2, 2, 1], [2, 3, 3, 2], [3, 0, 0, 3]];

  sides.forEach(s => {
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

  return { oreVertices };
};
