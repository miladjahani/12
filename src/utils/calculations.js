// src/utils/calculations.js

const getAdjacentPads = (pad, allPads) => {
    const adjacent = { left: null, right: null, front: null, back: null };
    if (!pad || !allPads) return adjacent;

    allPads.forEach(p => {
        if (p.id === pad.id || p.lift !== pad.lift) return;

        // Check adjacency based on position and dimensions
        const isSameLevel = p.z === pad.z && p.W === pad.W;
        const isSameColumn = p.x === pad.x && p.L === pad.L;

        if (isSameLevel && p.x + p.L === pad.x) adjacent.left = p;
        if (isSameLevel && p.x === pad.x + pad.L) adjacent.right = p;
        if (isSameColumn && p.z === pad.z + pad.W) adjacent.front = p;
        if (isSameColumn && p.z + p.W === pad.z) adjacent.back = p;
    });

    return adjacent;
};

export function calculatePadStats(pad, terrain, allPads) {
    if (!pad || !terrain) return null;

    const { L, W, H: H_avg, slopeDeg, dens, grade, rec, irrRate, lat, emit } = pad;
    const { sx: terrainSx, sy: terrainSy } = terrain;

    const sx = terrainSx / 100;
    const sy = terrainSy / 100;

    const adjacent = getAdjacentPads(pad, allPads);

    const slope_ratio = 1 / Math.tan(slopeDeg * Math.PI / 180);
    const crest_elev = H_avg;
    const hL = L / 2, hW = W / 2;

    const getY = (x, z) => x * sx + z * sy;

    // Corner ground heights relative to the pad's center height
    const hTL = crest_elev - getY(-hL, -hW);
    const hTR = crest_elev - getY(hL, -hW);
    const hBR = crest_elev - getY(hL, hW);
    const hBL = crest_elev - getY(-hL, hW);

    const getRun = (height, boundaryType, isAdjacent) => {
        if (boundaryType === 'wall') return 0;
        if (boundaryType === 'attach' && isAdjacent) {
            return height * slope_ratio * 0.5; // Reduced effect for attached pads
        }
        return height * slope_ratio;
    };

    // Runs for each side based on boundary conditions
    const runTL = getRun(hTL, pad.bounds.L, adjacent.left);
    const runTR = getRun(hTR, pad.bounds.R, adjacent.right);
    const runBR = getRun(hBR, pad.bounds.F, adjacent.front);
    const runBL = getRun(hBL, pad.bounds.B, adjacent.back);

    // Top dimensions
    const topL = Math.max(0, L - (runTL + runTR));
    const topW = Math.max(0, W - (runBL + runBR));

    const baseArea = L * W;
    const topArea = topL * topW;

    // Prismoidal formula for volume
    const midL = (L + topL) / 2;
    const midW = (W + topW) / 2;
    const midArea = midL * midW;
    const vol = (H_avg / 6) * (baseArea + topArea + 4 * midArea);

    const mass = vol * dens;
    const cu = mass * (grade / 100) * (rec / 100);
    const acid = mass * 0.015; // Assuming 15 kg/t

    // Irrigation
    const latSpace = lat / 100;
    const emitSpace = emit / 100;
    const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
    const latLen = numLat * topW;
    const emitCount = emitSpace > 0 ? Math.floor(latLen / emitSpace) : 0;
    const flow_m3_hr = (emitCount * irrRate * 60) / 1000000;
    const pipeLen = topL + latLen;

    // Hip lengths (approximated for simplicity in this refactor)
    const dist = (dx, dz, dy) => Math.sqrt(dx * dx + dz * dz + dy * dy);
    const hipFL = dist(runBL, runTL, hTL);
    const hipFR = dist(runBR, runTR, hTR);
    const hipBL = dist(runBL, runTL, hBL);
    const hipBR = dist(runBR, runTR, hBR);

    return {
        cu, vol, acid, flow_m3_hr, mass,
        baseArea, topArea, topL, topW,
        hTL, hTR, hBR, hBL,
        hipFL, hipFR, hipBL, hipBR,
        emitCount, pipeLen,
        collectorLen: topL,
        lateralLen: latLen
    };
}
