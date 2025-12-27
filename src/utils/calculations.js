export const getAdjacentPads = (pad, pads) => {
    const adjacent = {
        left: null,
        right: null,
        front: null,
        back: null
    };

    pads.forEach(p => {
        if (p.id === pad.id || p.lift !== pad.lift) return;

        // Check if p is to the left of pad
        if (p.x + p.L === pad.x && p.z === pad.z && p.W === pad.W) {
            adjacent.left = p;
        }

        // Check if p is to the right of pad
        if (p.x === pad.x + pad.L && p.z === pad.z && p.W === pad.W) {
            adjacent.right = p;
        }

        // Check if p is in front of pad (positive z direction)
        if (p.x === pad.x && p.z === pad.z + pad.W && p.L === pad.L) {
            adjacent.front = p;
        }

        // Check if p is behind pad (negative z direction)
        if (p.x === pad.x && p.z + p.W === pad.z && p.L === pad.L) {
            adjacent.back = p;
        }
    });

    return adjacent;
};

export const calculatePadStats = (pad, pads, terrain) => {
    if (!pad) return {};

    const adjacent = getAdjacentPads(pad, pads);

    const H_avg = pad.H;
    const slope_deg = pad.slopeDeg;
    const L = pad.L;
    const W = pad.W;
    const sx = terrain.sx / 100;
    const sy = terrain.sy / 100;
    const dens = pad.dens;
    const grade = pad.grade / 100;
    const rec = pad.rec / 100;
    const irrRate = pad.irrRate;
    const latSpace = pad.lat / 100;
    const emitSpace = pad.emit / 100;

    const slope_ratio = 1 / Math.tan(slope_deg * Math.PI / 180);
    const crest_elev = H_avg;
    const hL = L / 2, hW = W / 2;

    const getY = (x, z) => x * sx + z * sy;

    // Corner ground heights
    const hTL = crest_elev - getY(-hL, -hW);
    const hTR = crest_elev - getY(hL, -hW);
    const hBR = crest_elev - getY(hL, hW);
    const hBL = crest_elev - getY(-hL, hW);

    // Runs based on boundary types and adjacent pads
    const getRun = (height, boundaryType, isAdjacent) => {
        if (boundaryType === 'wall') return 0;
        if (boundaryType === 'attach' && isAdjacent) {
            return height * slope_ratio * 0.5;
        }
        return height * slope_ratio;
    };

    const runTL = getRun(hTL, pad.bounds.L, adjacent.left);
    const runTR = getRun(hTR, pad.bounds.R, adjacent.right);
    const runBR = getRun(hBR, pad.bounds.F, adjacent.front);
    const runBL = getRun(hBL, pad.bounds.B, adjacent.back);

    // Top dimensions
    let topL = Math.max(0, L - (runTL + runTR));
    let topW = Math.max(0, W - (runBL + runBR));

    if (pad.bounds.L === 'attach' && adjacent.left) {
        topL = Math.min(topL, L - 0.1);
    }

    if (pad.bounds.R === 'attach' && adjacent.right) {
        topL = Math.min(topL, L - 0.1);
    }

    if (pad.bounds.F === 'attach' && adjacent.front) {
        topW = Math.min(topW, W - 0.1);
    }

    if (pad.bounds.B === 'attach' && adjacent.back) {
        topW = Math.min(topW, W - 0.1);
    }

    // Calculate areas
    const baseArea = L * W;
    const topArea = topL * topW;

    // Prismoidal formula for volume
    const midL = (L + topL) / 2;
    const midW = (W + topW) / 2;
    const midArea = midL * midW;
    const vol = (H_avg / 6) * (baseArea + topArea + 4 * midArea);

    // Calculate mass and recoverable copper
    const mass = vol * dens;
    const cu = mass * grade * rec;
    const acid = mass * 0.015;

    // Piping calculations
    const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
    const latLen = numLat * topW;
    const emitCount = emitSpace > 0 ? Math.floor(latLen / emitSpace) : 0;
    const flow_m3_hr = (emitCount * irrRate * 60) / 1000000;
    const pipeLen = topL + latLen;

    // Hip (edge) lengths
    const dist = (dx, dz, dy) => Math.sqrt(dx * dx + dz * dz + dy * dy);

    const hipFL = dist(runBL, runTL, hTL);
    const hipFR = dist(runBR, runTR, hTR);
    const hipBL = dist(runBL, runTL, hBL);
    const hipBR = dist(runBR, runTR, hBR);

    return {
        cu,
        vol,
        acid,
        flow_m3_hr,
        mass,
        baseArea,
        topArea,
        topL,
        topW,
        emitCount,
        hTL, hTR, hBL, hBR,
        hipFL, hipFR, hipBL, hipBR,
        pipeLen,
        latLen,
        numLat
    };
};
