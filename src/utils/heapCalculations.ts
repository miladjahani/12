export interface PadBounds {
  L: 'free' | 'wall' | 'attach';
  R: 'free' | 'wall' | 'attach';
  F: 'free' | 'wall' | 'attach';
  B: 'free' | 'wall' | 'attach';
}

export interface Pad {
  id: string;
  name: string;
  x: number;
  z: number;
  L: number;
  W: number;
  H: number;
  lift: number;
  slopeDeg: number;
  bounds: PadBounds;
  lat: number; // lateral spacing in cm
  emit: number; // emitter spacing in cm
  irrRate: number; // irr rate in mL/min
  grade: number; // copper grade in %
  rec: number; // recovery in %
  dens: number; // density in t/m3
}

export interface Terrain {
  sx: number; // slope in x %
  sy: number; // slope in y %
}

export interface CalculationResults {
  vol: number;
  mass: number;
  cu: number;
  acid: number;
  baseArea: number;
  topArea: number;
  topL: number;
  topW: number;
  emitCount: number;
  flowRate: number;
  pipeLen: number;
  cornerHeights: {
    FL: number;
    FR: number;
    BL: number;
    BR: number;
  };
}

export const calculatePadResults = (pad: Pad, terrain: Terrain, allPads: Pad[]): CalculationResults => {
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;
  const slopeRatio = 1 / Math.tan((pad.slopeDeg * Math.PI) / 180);

  // Elevation relative to ground at pad origin (center-based or corner-based?)
  // Original script uses center-relative coordinates for geometry but (x,z) as start point?
  // Let's stick to the script's logic: c = [{x:-L/2, z:-W/2}, ...]

  const getGroundY = (lx: number, lz: number) => (pad.x + lx) * sx + (pad.z + lz) * sy;

  // Corner heights relative to pad base
  const hBL = pad.H - getGroundY(-pad.L / 2, -pad.W / 2);
  const hBR = pad.H - getGroundY(pad.L / 2, -pad.W / 2);
  const hFR = pad.H - getGroundY(pad.L / 2, pad.W / 2);
  const hFL = pad.H - getGroundY(-pad.L / 2, pad.W / 2);

  const adjacent = getAdjacentPads(pad, allPads);

  const getRun = (h: number, type: 'free' | 'wall' | 'attach', hasAdj: boolean) => {
    if (type === 'wall') return 0;
    if (type === 'attach' && hasAdj) return h * slopeRatio * 0.5;
    return h * slopeRatio;
  };

  const runL = getRun((hBL + hFL) / 2, pad.bounds.L, !!adjacent.left);
  const runR = getRun((hBR + hFR) / 2, pad.bounds.R, !!adjacent.right);
  const runF = getRun((hFL + hFR) / 2, pad.bounds.F, !!adjacent.front);
  const runB = getRun((hBL + hBR) / 2, pad.bounds.B, !!adjacent.back);

  const topL = Math.max(0, pad.L - (runL + runR));
  const topW = Math.max(0, pad.W - (runF + runB));

  const baseArea = pad.L * pad.W;
  const topArea = topL * topW;
  const midArea = ((pad.L + topL) / 2) * ((pad.W + topW) / 2);

  const vol = (pad.H / 6) * (baseArea + topArea + 4 * midArea);
  const mass = vol * pad.dens;
  const cu = mass * (pad.grade / 100) * (pad.rec / 100);
  const acid = mass * 0.015;

  const latSpace = pad.lat / 100;
  const emitSpace = pad.emit / 100;

  const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
  const latLenTotal = numLat * topW;
  const emitCount = emitSpace > 0 ? Math.floor(latLenTotal / emitSpace) : 0;
  const flowRate = (emitCount * pad.irrRate * 60) / 1000000;
  const pipeLen = topL + latLenTotal;

  return {
    vol, mass, cu, acid, baseArea, topArea, topL, topW, emitCount, flowRate, pipeLen,
    cornerHeights: {
      BL: hBL, BR: hBR, FL: hFL, FR: hFR
    }
  };
};

export const getAdjacentPads = (pad: Pad, allPads: Pad[]) => {
  const epsilon = 0.1;
  return {
    left: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x + p.L - pad.x) < epsilon && Math.abs(p.z - pad.z) < epsilon),
    right: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x - (pad.x + pad.L)) < epsilon && Math.abs(p.z - pad.z) < epsilon),
    front: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z - (pad.z + pad.W)) < epsilon && Math.abs(p.x - pad.x) < epsilon),
    back: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z + p.W - pad.z) < epsilon && Math.abs(p.x - pad.x) < epsilon),
  };
};
