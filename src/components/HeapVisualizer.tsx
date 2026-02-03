import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePads } from '../context/PadsContext';
import { generatePadGeometry } from '../utils/geometryGenerator';
import { Download, Box, Video, Tags } from 'lucide-react';
import { generatePDF } from '../utils/pdfExport';

const PadMesh = ({ pad, terrain, allPads, isSelected }: any) => {
  const { oreVertices } = useMemo(() => generatePadGeometry(pad, terrain, allPads), [pad, terrain, allPads]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(oreVertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [oreVertices]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={isSelected ? "#3b82f6" : "#b45309"}
        roughness={0.8}
        metalness={0.2}
        emissive={isSelected ? "#1d4ed8" : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[geometry]} />
          <lineBasicMaterial attach="material" color="white" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

const Ground = ({ terrain }: any) => {
  const sx = terrain.sx / 100;
  const sy = terrain.sy / 100;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
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
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <meshStandardMaterial color="#1e293b" transparent opacity={0.4} wireframe />
    </mesh>
  );
};

const HeapVisualizer: React.FC = () => {
  const { pads, selectedPadId, terrain } = usePads();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExportPDF = () => {
    if (canvasRef.current) {
        const screenshot = canvasRef.current.toDataURL('image/png');
        const selectedPad = pads.find(p => p.id === selectedPadId);
        if (selectedPad) {
            generatePDF(selectedPad, terrain, pads, screenshot);
        }
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => { (canvasRef as any).current = gl.domElement; }}
      >
        <PerspectiveCamera makeDefault position={[300, 250, 400]} far={5000} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[200, 500, 200]} intensity={1} castShadow />

        <Ground terrain={terrain} />
        <Grid infiniteGrid fadeDistance={1000} sectionColor="#2b5278" cellColor="#1e293b" />

        {pads.map(pad => (
          <PadMesh
            key={pad.id}
            pad={pad}
            terrain={terrain}
            allPads={pads}
            isSelected={selectedPadId === pad.id}
          />
        ))}
      </Canvas>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleExportPDF}
          className="bg-[--telegram-active] p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 text-sm font-bold"
        >
          <Download size={18} /> خروجی PDF هوشمند
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-[10px] space-y-1">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#b45309] rounded-full"></div> پد معمولی</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div> پد انتخاب شده</div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
