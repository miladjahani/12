import { useMemo } from 'react';
import { usePads } from '../context/PadsContext';
import { generatePadGeometry } from '../utils/geometry';
import { Pad, Terrain } from '../types';

interface CustomPadMeshProps {
  pad: Pad;
  terrain: Terrain;
}

const CustomPadMesh = ({ pad, terrain }: CustomPadMeshProps) => {
  const { pads } = usePads();

  // Memoize the geometry to avoid re-computation on every render
  const geometry = useMemo(() => generatePadGeometry(pad, terrain, pads), [pad, terrain, pads]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={pad.lift > 1 ? '#a16207' : '#ca8a04'}
        roughness={0.8}
        flatShading={true}
      />
    </mesh>
  );
};

export default CustomPadMesh;
