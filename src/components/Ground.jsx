import React, { useMemo } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const Ground = ({ terrain }) => {
    const geometry = useMemo(() => {
        const geom = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        const sx = terrain.sx / 100;
        const sy = terrain.sy / 100;
        const positions = geom.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 1];
            positions[i + 2] = (x * sx) + (-z * sy);
        }
        geom.computeVertexNormals();
        return geom;
    }, [terrain]);

    return (
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <meshStandardMaterial color="#374151" roughness={1.0} transparent opacity={0.3} />
        </mesh>
    );
};

export default Ground;
