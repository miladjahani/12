import React, { useMemo } from 'react';
import * as THREE from 'three';

// Helper to find adjacent pads
const getAdjacentPads = (pad, allPads) => {
    const adjacent = { left: null, right: null, front: null, back: null };
    if (!pad || !allPads) return adjacent;
    allPads.forEach(p => {
        if (p.id === pad.id || p.lift !== pad.lift) return;
        if (p.x + p.L === pad.x && p.z === pad.z) adjacent.left = p;
        if (p.x === pad.x + pad.L && p.z === pad.z) adjacent.right = p;
        if (p.x === pad.x && p.z === pad.z + pad.W) adjacent.front = p;
        if (p.x === pad.x && p.z + p.W === pad.z) adjacent.back = p;
    });
    return adjacent;
};

const Pad3D = ({ pad, terrain, allPads, isSelected }) => {
    const geometry = useMemo(() => {
        if (!pad) return new THREE.BufferGeometry();

        const { L, W, H, slopeDeg } = pad;
        const hL = L / 2;
        const hW = W / 2;
        const sx = terrain.sx / 100;
        const sy = terrain.sy / 100;
        const slope_ratio = 1 / Math.tan(slopeDeg * Math.PI / 180);
        const adjacent = getAdjacentPads(pad, allPads);

        const getTerrainHeight = (x, z) => (pad.x + x) * sx + (pad.z + z) * sy;

        const crest_elev = H;

        const heights = {
            BL: crest_elev - getTerrainHeight(-hL, -hW), // Back-Left
            BR: crest_elev - getTerrainHeight(hL, -hW),  // Back-Right
            FR: crest_elev - getTerrainHeight(hL, hW),   // Front-Right
            FL: crest_elev - getTerrainHeight(-hL, hW),   // Front-Left
        };

        const getRun = (height, boundaryType, isAdjacent) => {
            if (boundaryType === 'wall') return 0;
            if (boundaryType === 'attach' && isAdjacent) return height * slope_ratio * 0.5;
            return height * slope_ratio;
        };

        const runs = {
            L: getRun(heights.BL, pad.bounds.L, adjacent.left), // Run on the left side
            R: getRun(heights.BR, pad.bounds.R, adjacent.right), // Run on the right side
            B: getRun(heights.BL, pad.bounds.B, adjacent.back), // Run on the back side
            F: getRun(heights.FL, pad.bounds.F, adjacent.front)  // Run on the front side
        };

        const baseCorners = [
            new THREE.Vector3(-hL, getTerrainHeight(-hL, -hW), -hW), // 0: BL
            new THREE.Vector3(hL, getTerrainHeight(hL, -hW), -hW),  // 1: BR
            new THREE.Vector3(hL, getTerrainHeight(hL, hW), hW),   // 2: FR
            new THREE.Vector3(-hL, getTerrainHeight(-hL, hW), hW)    // 3: FL
        ];

        const topCorners = [
            new THREE.Vector3(-hL + runs.L, crest_elev, -hW + runs.B), // 0: BL
            new THREE.Vector3(hL - runs.R, crest_elev, -hW + runs.B),  // 1: BR
            new THREE.Vector3(hL - runs.R, crest_elev, hW - runs.F),   // 2: FR
            new THREE.Vector3(-hL + runs.L, crest_elev, hW - runs.F)    // 3: FL
        ];

        const vertices = [];
        const addTriangle = (v1, v2, v3) => vertices.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);

        // Bottom Face
        addTriangle(baseCorners[0], baseCorners[2], baseCorners[1]);
        addTriangle(baseCorners[0], baseCorners[3], baseCorners[2]);

        // Top Face
        addTriangle(topCorners[0], topCorners[1], topCorners[2]);
        addTriangle(topCorners[0], topCorners[2], topCorners[3]);

        // Sides
        for (let i = 0; i < 4; i++) {
            const next = (i + 1) % 4;
            addTriangle(baseCorners[i], baseCorners[next], topCorners[next]);
            addTriangle(baseCorners[i], topCorners[next], topCorners[i]);
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geom.computeVertexNormals();
        return geom;

    }, [pad, terrain, allPads]);

    return (
        <mesh position={[pad.x, 0, pad.z]} geometry={geometry}>
            <meshStandardMaterial
                color={isSelected ? '#3b82f6' : '#b45309'}
                roughness={0.9}
                metalness={0.1}
                flatShading={true}
                emissive={isSelected ? '#2563eb' : '#000000'}
                emissiveIntensity={isSelected ? 0.5 : 0}
            />
        </mesh>
    );
};

export default Pad3D;
