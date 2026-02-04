import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Sky, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { usePads } from '../context/PadsContext';
import { generatePadGeometry } from '../utils/geometryGenerator';

const PadMesh: React.FC<{ pad: any, allPads: any[], terrain: any }> = ({ pad, allPads, terrain }) => {
  const { oreVertices } = useMemo(() => generatePadGeometry(pad, allPads, terrain), [pad, allPads, terrain]);

  const color = useMemo(() => {
    const baseColor = new THREE.Color('#b45309');
    if (pad.lift > 1) {
      baseColor.multiplyScalar(1 - (pad.lift - 1) * 0.1);
    }
    return baseColor;
  }, [pad.lift]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={oreVertices}
          count={oreVertices.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
    </mesh>
  );
};

const SiteGround: React.FC<{ terrain: any }> = ({ terrain }) => {
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2000, 2000, 50, 50);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, x * sx + -y * sy);
    }
    geo.computeVertexNormals();
    return geo;
  }, [sx, sy]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#2d3748" transparent opacity={0.4} />
    </mesh>
  );
};

const Scene3D: React.FC = () => {
  const { pads, terrain } = usePads();

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[400, 300, 400]} far={5000} />
      <OrbitControls makeDefault />

      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[200, 500, 200]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <SiteGround terrain={terrain} />

      {pads.map((pad) => (
        <PadMesh key={pad.id} pad={pad} allPads={pads} terrain={terrain} />
      ))}

      <Grid
        infiniteGrid
        fadeDistance={1000}
        fadeStrength={5}
        cellSize={50}
        sectionSize={250}
        sectionColor="#40a7e3"
        cellColor="#2b5278"
      />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={2000}
        blur={2}
        far={50}
      />
    </Canvas>
  );
};

export default Scene3D;
