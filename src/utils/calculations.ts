import { Pad, Terrain } from '../types';

export const calculatePadStats = (pad: Pad, allPads: Pad[], terrain: Terrain) => {
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

  const getGroundY = (relX: number, relZ: number) => (pad.x + relX) * sx + (pad.z + relZ) * sy;

  // Corner heights relative to ground
  const hTL = pad.H - getGroundY(-pad.L / 2, -pad.W / 2);
  const hTR = pad.H - getGroundY(pad.L / 2, -pad.W / 2);
  const hBR = pad.H - getGroundY(pad.L / 2, pad.W / 2);
  const hBL = pad.H - getGroundY(-pad.L / 2, pad.W / 2);

  const getRun = (h: number, type: string, hasAdj: boolean) => {
    if (type === 'wall') return 0;
    return h * slope_ratio * (type === 'attach' && hasAdj ? 0.5 : 1);
  };

  const runL = getRun((hTL + hBL) / 2, pad.bounds.L, !!adj.left);
  const runR = getRun((hTR + hBR) / 2, pad.bounds.R, !!adj.right);
  const runF = getRun((hBR + hBL) / 2, pad.bounds.F, !!adj.front);
  const runB = getRun((hTR + hTL) / 2, pad.bounds.B, !!adj.back);

  const topL = Math.max(0, pad.L - (runL + runR));
  const topW = Math.max(0, pad.W - (runF + runB));

  const baseArea = pad.L * pad.W;
  const topArea = topL * topW;
  const midArea = ((pad.L + topL) / 2) * ((pad.W + topW) / 2);
  const vol = (pad.H / 6) * (baseArea + topArea + 4 * midArea);
  const mass = vol * pad.dens;
  const cu = mass * (pad.grade / 100) * (pad.rec / 100);
  const acid = mass * 0.015; // 15kg/t

  const latSpace = pad.lat / 100;
  const emitSpace = pad.emit / 100;

  const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
  const latLen = numLat * topW;
  const emitCount = emitSpace > 0 ? Math.floor(latLen / emitSpace) : 0;
  const flow_m3_hr = (emitCount * pad.irrRate * 60) / 1000000;
  const pipeLen = topL + latLen;

  const dist = (dx: number, dz: number, dy: number) => Math.sqrt(dx * dx + dz * dz + dy * dy);

  return {
    vol,
    mass,
    cu,
    acid,
    topL,
    topW,
    baseArea,
    topArea,
    emitCount,
    flow_m3_hr,
    pipeLen,
    latLen,
    hBL,
    hBR,
    hTL,
    hTR,
    hipFL: dist(runL, runF, hBL),
    hipFR: dist(runR, runF, hBR),
    hipBL: dist(runL, runB, hTL),
    hipBR: dist(runR, runB, hTR),
  };
};

export const formatNumber = (n: number, decimals = 0) => {
  return n.toLocaleString('fa-IR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
