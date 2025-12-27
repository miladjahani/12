import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getAdjacentPads } from '../utils/calculations';

const Pad = ({ pad, allPads, terrain, isSelected }) => {
  const geometry = useMemo(() => {
    const hL = pad.L / 2;
    const hW = pad.W / 2;
    const sx = terrain.sx / 100;
    const sy = terrain.sy / 100;
    const slope_ratio = 1 / Math.tan(pad.slopeDeg * Math.PI / 180);
    const adjacent = getAdjacentPads(pad, allPads);

    const getTerrainHeight = (x, z) => (x * sx) + (z * sy);
    const getRun = (height, boundaryType, isAdjacent) => {
      if (boundaryType === 'wall') return 0;
      if (boundaryType === 'attach' && isAdjacent) return height * slope_ratio * 0.5;
      return height * slope_ratio;
    };

    const crest_elev = pad.H;
    const heights = {
      TL: crest_elev - getTerrainHeight(-hL, -hW),
      TR: crest_elev - getTerrainHeight(hL, -hW),
      BR: crest_elev - getTerrainHeight(hL, hW),
      BL: crest_elev - getTerrainHeight(-hL, hW),
    };

    const runs = {
        // Runs for the X-axis offsets
        L_at_TL: getRun(heights.TL, pad.bounds.L, adjacent.left),
        L_at_BL: getRun(heights.BL, pad.bounds.L, adjacent.left),
        R_at_TR: getRun(heights.TR, pad.bounds.R, adjacent.right),
        R_at_BR: getRun(heights.BR, pad.bounds.R, adjacent.right),
        // Runs for the Z-axis offsets
        B_at_TL: getRun(heights.TL, pad.bounds.B, adjacent.back),
        B_at_TR: getRun(heights.TR, pad.bounds.B, adjacent.back),
        F_at_BL: getRun(heights.BL, pad.bounds.F, adjacent.front),
        F_at_BR: getRun(heights.BR, pad.bounds.F, adjacent.front),
    };

    const baseCorners = [
      new THREE.Vector3(-hL, getTerrainHeight(-hL, -hW), -hW),
      new THREE.Vector3(hL, getTerrainHeight(hL, -hW), -hW),
      new THREE.Vector3(hL, getTerrainHeight(hL, hW), hW),
      new THREE.Vector3(-hL, getTerrainHeight(-hL, hW), hW),
    ];

    const topCorners = [
        new THREE.Vector3(-hL + runs.L_at_TL, crest_elev, -hW + runs.B_at_TL),
        new THREE.Vector3(hL - runs.R_at_TR, crest_elev, -hW + runs.B_at_TR),
        new THREE.Vector3(hL - runs.R_at_BR, crest_elev, hW - runs.F_at_BR),
        new THREE.Vector3(-hL + runs.L_at_BL, crest_elev, hW - runs.F_at_BL),
    ];

    const vertices = [];
    const addTriangle = (v1, v2, v3) => vertices.push(v1, v2, v3);

    const sides = [[0, 3], [3, 2], [2, 1], [1, 0]];
    sides.forEach(([i1, i2]) => {
      addTriangle(baseCorners[i1], baseCorners[i2], topCorners[i2]);
      addTriangle(baseCorners[i1], topCorners[i2], topCorners[i1]);
    });

    addTriangle(topCorners[0], topCorners[1], topCorners[2]);
    addTriangle(topCorners[0], topCorners[2], topCorners[3]);

    addTriangle(baseCorners[0], baseCorners[2], baseCorners[1]);
    addTriangle(baseCorners[0], baseCorners[3], baseCorners[2]);

    const geom = new THREE.BufferGeometry();
    const verticesFlat = new Float32Array(vertices.flatMap(v => v.toArray()));
    geom.setAttribute('position', new THREE.BufferAttribute(verticesFlat, 3));
    geom.computeVertexNormals();
    return geom;
  }, [pad, allPads, terrain]);

  const color = new THREE.Color(isSelected ? '#3b82f6' : '#b45309');
  if (pad.lift > 1) {
    color.offsetHSL(0, 0, -0.1 * (pad.lift - 1));
  }

  return (
    <mesh geometry={geometry} position={[pad.x, 0, pad.z]} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
};

export default Pad;
