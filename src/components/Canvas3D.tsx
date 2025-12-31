import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Pad as PadType, Terrain } from '../utils/types';
import * as THREE from 'three';
import { useMemo } from 'react';

interface Canvas3DProps {
  pads: PadType[];
  selectedPad: PadType | null;
  terrain: Terrain;
  glRef: React.RefObject<THREE.WebGLRenderer | null>;
}

const PadGeometry: React.FC<{ pad: PadType, terrain: Terrain, allPads: PadType[] }> = ({ pad, terrain, allPads }) => {
  const geometry = useMemo(() => {
    const { L, W, H, slopeDeg, bounds } = pad;
    const sx = terrain.sx / 100;
    const sy = terrain.sy / 100;
    const hL = L / 2;
    const hW = W / 2;
    const slope_ratio = slopeDeg === 90 ? 0 : 1 / Math.tan(slopeDeg * Math.PI / 180);

    const getTerrainY = (x: number, z: number) => (pad.x + x) * sx + (pad.z + z) * sy;

    const h_bl = H - getTerrainY(-hL, -hW);
    const h_br = H - getTerrainY(hL, -hW);
    const h_fr = H - getTerrainY(hL, hW);
    const h_fl = H - getTerrainY(-hL, hW);

    const getRun = (height: number, boundaryType: PadType['bounds']['L']) => {
      if (boundaryType === 'wall') return 0;
      return height * slope_ratio;
    };

    const run_l = getRun(h_bl, bounds.L);
    const run_r = getRun(h_br, bounds.R);
    const run_f = getRun(h_fr, bounds.F);
    const run_b = getRun(h_fl, bounds.B);

    const base_bl = new THREE.Vector3(-hL, getTerrainY(-hL, -hW), -hW);
    const base_br = new THREE.Vector3(hL, getTerrainY(hL, -hW), -hW);
    const base_fr = new THREE.Vector3(hL, getTerrainY(hL, hW), hW);
    const base_fl = new THREE.Vector3(-hL, getTerrainY(-hL, hW), hW);

    const top_bl = new THREE.Vector3(-hL + run_l, H, -hW + run_b);
    const top_br = new THREE.Vector3(hL - run_r, H, -hW + run_b);
    const top_fr = new THREE.Vector3(hL - run_r, H, hW - run_f);
    const top_fl = new THREE.Vector3(-hL + run_l, H, hW - run_f);

    const vertices = new Float32Array([
      // Top face
      ...top_bl.toArray(), ...top_br.toArray(), ...top_fr.toArray(),
      ...top_bl.toArray(), ...top_fr.toArray(), ...top_fl.toArray(),
      // Bottom face
      ...base_bl.toArray(), ...base_fr.toArray(), ...base_br.toArray(),
      ...base_bl.toArray(), ...base_fl.toArray(), ...base_fr.toArray(),
      // Left face
      ...base_bl.toArray(), ...top_fl.toArray(), ...top_bl.toArray(),
      ...base_bl.toArray(), ...base_fl.toArray(), ...top_fl.toArray(),
      // Right face
      ...base_br.toArray(), ...top_br.toArray(), ...top_fr.toArray(),
      ...base_br.toArray(), ...top_fr.toArray(), ...base_fr.toArray(),
      // Back face
      ...base_br.toArray(), ...top_bl.toArray(), ...top_br.toArray(),
      ...base_br.toArray(), ...base_bl.toArray(), ...top_bl.toArray(),
      // Front face
      ...base_fl.toArray(), ...top_fr.toArray(), ...top_fl.toArray(),
      ...base_fl.toArray(), ...base_fr.toArray(), ...top_fr.toArray(),
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [pad, terrain, allPads]);

  return <primitive object={geometry} />;
};

const Pad: React.FC<{ pad: PadType, isSelected: boolean, terrain: Terrain, allPads: PadType[] }> = ({ pad, isSelected, terrain, allPads }) => {
  return (
    <mesh
      position={[pad.x, 0, pad.z]}
      castShadow
      receiveShadow
    >
      <PadGeometry pad={pad} terrain={terrain} allPads={allPads} />
      <meshStandardMaterial
        color={isSelected ? '#3b82f6' : '#a16207'}
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
};


const Canvas3D: React.FC<Canvas3DProps> = ({ pads, selectedPad, terrain, glRef }) => {
  return (
    <Canvas
      camera={{ position: [300, 250, 400], fov: 45 }}
      shadows
      gl={(canvas) => {
        const renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true });
        if (glRef) {
          (glRef as React.MutableRefObject<THREE.WebGLRenderer | null>).current = renderer;
        }
        return renderer;
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[200, 500, 200]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Grid args={[1000, 20]} infiniteGrid fadeDistance={1000} sectionColor={'#666'} cellColor={'#444'} />

      {pads.map(pad => (
        <Pad
          key={pad.id}
          pad={pad}
          isSelected={selectedPad?.id === pad.id}
          terrain={terrain}
          allPads={pads}
        />
      ))}

      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Canvas3D;