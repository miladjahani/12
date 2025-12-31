import { Pad, Terrain, CalculationResults } from './types';

interface AdjacentPads {
  left: Pad | null;
  right: Pad | null;
  front: Pad | null;
  back: Pad | null;
}

/**
 * Calculates all geometric and metallurgical statistics for a given heap leach pad.
 * This is a pure function, decoupled from the application state and DOM.
 * @param pad - The primary pad for which to run calculations.
 * @param allPads - An array of all pads in the project, for adjacency checks.
 * @param terrain - The global terrain slope parameters.
 * @returns A comprehensive object of calculation results.
 */
export const calculatePadStats = (
  pad: Pad,
  allPads: Pad[],
  terrain: Terrain
): CalculationResults => {
  // Helper function to find adjacent pads for slope calculations
  const getAdjacentPads = (currentPad: Pad): AdjacentPads => {
    const adjacent: AdjacentPads = { left: null, right: null, front: null, back: null };
    allPads.forEach(p => {
      if (p.id === currentPad.id || p.lift !== currentPad.lift) return;
      if (p.x + p.L === currentPad.x && p.z === currentPad.z) adjacent.left = p;
      if (p.x === currentPad.x + currentPad.L && p.z === currentPad.z) adjacent.right = p;
      if (p.x === currentPad.x && p.z === currentPad.z + currentPad.W) adjacent.front = p;
      if (p.x === currentPad.x && p.z + p.W === currentPad.z) adjacent.back = p;
    });
    return adjacent;
  };

  const adjacent = getAdjacentPads(pad);
  const { H, slopeDeg, L, W, dens, grade, rec, irrRate, lat, emit, bounds } = pad;
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;

  const gradePercent = grade / 100;
  const recPercent = rec / 100;
  const latSpace = lat / 100;
  const emitSpace = emit / 100;

  const slope_ratio = slopeDeg === 90 ? 0 : 1 / Math.tan(slopeDeg * Math.PI / 180);
  const hL = L / 2;
  const hW = W / 2;

  const getTerrainY = (x: number, z: number) => x * sx + z * sy;

  // Corner heights relative to the pad's average height (H)
  const hBackLeft = H - getTerrainY(-hL, -hW);
  const hBackRight = H - getTerrainY(hL, -hW);
  const hFrontRight = H - getTerrainY(hL, hW);
  const hFrontLeft = H - getTerrainY(-hL, hW);

  const getRun = (height: number, boundaryType: Pad['bounds']['L'], isAdjacent: Pad | null) => {
    if (boundaryType === 'wall') return 0;
    if (boundaryType === 'attach' && isAdjacent) return height * slope_ratio * 0.5;
    return height * slope_ratio;
  };

  // Horizontal distance from top edge to base edge for each side
  const runL = getRun(hBackLeft, bounds.L, adjacent.left);
  const runR = getRun(hBackRight, bounds.R, adjacent.right);
  const runF = getRun(hFrontRight, bounds.F, adjacent.front);
  const runB = getRun(hFrontLeft, bounds.B, adjacent.back);

  const topL = Math.max(0, L - (runL + runR));
  const topW = Math.max(0, W - (runB + runF));

  const baseArea = L * W;
  const topArea = topL * topW;

  const midL = (L + topL) / 2;
  const midW = (W + topW) / 2;
  const midArea = midL * midW;
  const vol = (H / 6) * (baseArea + topArea + 4 * midArea);

  const mass = vol * dens;
  const cu = mass * gradePercent * recPercent;
  const acid = mass * 15; // 15 kg/t

  const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
  const latLen = numLat > 0 ? numLat * topW : 0;
  const emitCount = emitSpace > 0 && latLen > 0 ? Math.floor(latLen / emitSpace) : 0;
  const flow = (emitCount * irrRate * 60) / 1000000; // m³/hr
  const pipeLen = topL + latLen;

  const dist = (dx: number, dz: number, dy: number) => Math.sqrt(dx * dx + dz * dz + dy * dy);

  // Corrected hip length calculations
  const hipBL = dist(runB, runL, hBackLeft);
  const hipBR = dist(runB, runR, hBackRight);
  const hipFR = dist(runF, runR, hFrontRight);
  const hipFL = dist(runF, runL, hFrontLeft);

  return {
    cu, vol, acid, flow, mass, baseArea, topArea, topL, topW, emitCount,
    hTL: hBackLeft, hTR: hBackRight, hBR: hFrontRight, hBL: hFrontLeft,
    hipFL, hipFR, hipBL, hipBR,
    pipeLen, latLen,
  };
};
