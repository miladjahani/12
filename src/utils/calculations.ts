import { Pad, Terrain } from '../types';

// Helper to get adjacent pads (simplified for now)
// In a real scenario, this would need access to the full pads array.
const getAdjacentPads = (pad: Pad, allPads: Pad[]) => {
    const epsilon = 0.1;
    return {
        left: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x + p.L - pad.x) < epsilon && Math.abs(p.z - pad.z) < epsilon),
        right: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x - (pad.x + pad.L)) < epsilon && Math.abs(p.z - pad.z) < epsilon),
        front: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z - (pad.z + pad.W)) < epsilon && Math.abs(p.x - pad.x) < epsilon),
        back: allPads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z + p.W - pad.z) < epsilon && Math.abs(p.x - pad.x) < epsilon),
    };
}

export const calculatePadResults = (pad: Pad, terrain: Terrain, allPads: Pad[]) => {
    if (!pad) return null;

    const adjacent = getAdjacentPads(pad, allPads);
    const { H, L, W, slopeDeg, dens, grade, rec, irrRate, lat, emit, bounds } = pad;
    const { sx, sy } = terrain;

    const slopeRatio = 1 / Math.tan(slopeDeg * Math.PI / 180);

    const getGroundY = (x: number, z: number) => (x + pad.x) * (sx / 100) + (z + pad.z) * (sy / 100);

    // Corner heights relative to average pad height
    const hTL = H - getGroundY(-L / 2, -W / 2);
    const hTR = H - getGroundY(L / 2, -W / 2);
    const hBR = H - getGroundY(L / 2, W / 2);
    const hBL = H - getGroundY(-L / 2, W / 2);

    const getRun = (h: number, type: Pad['bounds']['L'], adj: Pad | undefined) => {
        if (type === 'wall') return 0;
        if (type === 'attach' && adj) return h * slopeRatio * 0.5;
        return h * slopeRatio;
    };

    const runL = getRun((hTL + hBL) / 2, bounds.L, adjacent.left);
    const runR = getRun((hTR + hBR) / 2, bounds.R, adjacent.right);
    const runF = getRun((hBR + hBL) / 2, bounds.F, adjacent.front);
    const runB = getRun((hTR + hTL) / 2, bounds.B, adjacent.back);

    const topL = Math.max(0, L - (runL + runR));
    const topW = Math.max(0, W - (runF + runB));

    const baseArea = L * W;
    const topArea = topL * topW;
    const midArea = ((L + topL) / 2) * ((W + topW) / 2);

    // Prismoidal formula for volume
    const volume = (H / 6) * (baseArea + topArea + 4 * midArea);
    const mass = volume * dens;
    const recoverableCu = mass * (grade / 100) * (rec / 100);
    const acidConsumption = mass * 0.015; // Assuming 15kg/t

    // Irrigation
    const latSpaceM = lat / 100;
    const emitSpaceM = emit / 100;
    const numLaterals = latSpaceM > 0 ? Math.floor(topW / latSpaceM) : 0;
    const totalLateralLength = numLaterals * topL;
    const numEmitters = emitSpaceM > 0 ? Math.floor(totalLateralLength / emitSpaceM) : 0;
    const totalFlowM3h = (numEmitters * irrRate * 60) / 1_000_000;

    return {
        volume,
        mass,
        recoverableCu,
        acidConsumption,
        baseArea,
        topArea,
        topL,
        topW,
        numEmitters,
        totalFlowM3h,
        cornerHeights: {
            FL: hBL, FR: hBR, BL: hTL, BR: hTR
        }
    };
};
