import * as THREE from 'three';
import { Pad, Terrain } from '../types';

// This function generates the vertices for a custom pad geometry
export const generatePadGeometry = (pad: Pad, terrain: Terrain, allPads: Pad[]): THREE.BufferGeometry => {
    const { L, W, H, slopeDeg, bounds } = pad;
    const { sx, sy } = terrain;

    // Simplified adjacent pad logic for geometry generation
    const adjacent = {
        left: allPads.find(p => p.id !== pad.id && Math.abs(p.x + p.L - pad.x) < 0.1),
        right: allPads.find(p => p.id !== pad.id && Math.abs(p.x - (pad.x + pad.L)) < 0.1),
        front: allPads.find(p => p.id !== pad.id && Math.abs(p.z - (pad.z + pad.W)) < 0.1),
        back: allPads.find(p => p.id !== pad.id && Math.abs(p.z + p.W - pad.z) < 0.1),
    };

    const getBaseY = (x: number, z: number) => (x * (sx / 100)) + (z * (sy / 100)) + (pad.lift - 1) * H;
    const slopeRatio = 1 / Math.tan(slopeDeg * Math.PI / 180);

    const corners = [
        { x: -L / 2, z: -W / 2 }, // Top-Left (BL in original)
        { x:  L / 2, z: -W / 2 }, // Top-Right (BR)
        { x:  L / 2, z:  W / 2 }, // Bottom-Right (FR)
        { x: -L / 2, z:  W / 2 }  // Bottom-Left (FL)
    ];

    const heights = corners.map(c => H - (c.x * (sx/100) + c.z * (sy/100)));

    const getRun = (h: number, type: Pad['bounds']['L'], adj: Pad | undefined) => {
        if (type === 'wall') return 0;
        if (type === 'attach' && adj) return h * slopeRatio * 0.5;
        return h * slopeRatio;
    };

    const runL = getRun((heights[0] + heights[3]) / 2, bounds.L, adjacent.left);
    const runR = getRun((heights[1] + heights[2]) / 2, bounds.R, adjacent.right);
    const runB = getRun((heights[0] + heights[1]) / 2, bounds.B, adjacent.back); // Original logic used B for F/B
    const runF = getRun((heights[2] + heights[3]) / 2, bounds.F, adjacent.front);

    const topCorners = [
        { x: corners[0].x + runL, z: corners[0].z + runB },
        { x: corners[1].x - runR, z: corners[1].z + runB },
        { x: corners[2].x - runR, z: corners[2].z - runF },
        { x: corners[3].x + runL, z: corners[3].z - runF }
    ];

    const baseVertices = corners.map(c => new THREE.Vector3(pad.x + c.x, getBaseY(pad.x + c.x, pad.z + c.z), pad.z + c.z));
    const topVertices = topCorners.map((c, i) => new THREE.Vector3(pad.x + c.x, getBaseY(pad.x + c.x, pad.z + c.z) + heights[i], pad.z + c.z));

    const vertices: number[] = [];

    // Sides
    vertices.push(...baseVertices[0].toArray(), ...baseVertices[1].toArray(), ...topVertices[1].toArray());
    vertices.push(...baseVertices[0].toArray(), ...topVertices[1].toArray(), ...topVertices[0].toArray());

    vertices.push(...baseVertices[1].toArray(), ...baseVertices[2].toArray(), ...topVertices[2].toArray());
    vertices.push(...baseVertices[1].toArray(), ...topVertices[2].toArray(), ...topVertices[1].toArray());

    vertices.push(...baseVertices[2].toArray(), ...baseVertices[3].toArray(), ...topVertices[3].toArray());
    vertices.push(...baseVertices[2].toArray(), ...topVertices[3].toArray(), ...topVertices[2].toArray());

    vertices.push(...baseVertices[3].toArray(), ...baseVertices[0].toArray(), ...topVertices[0].toArray());
    vertices.push(...baseVertices[3].toArray(), ...topVertices[0].toArray(), ...topVertices[3].toArray());

    // Top face
    vertices.push(...topVertices[0].toArray(), ...topVertices[1].toArray(), ...topVertices[2].toArray());
    vertices.push(...topVertices[0].toArray(), ...topVertices[2].toArray(), ...topVertices[3].toArray());

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    return geometry;
};
