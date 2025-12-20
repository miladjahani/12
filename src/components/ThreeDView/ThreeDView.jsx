import React, { Suspense, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import Pad3D from './Pad3D';

const ThreeDView = forwardRef(({ pads, selectedPad, terrain }, ref) => {
  return (
    <div ref={ref} className="three-d-view">
      <Canvas camera={{ position: [300, 250, 400], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[200, 500, 200]} intensity={0.8} />

          {/* Controls */}
          <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2 - 0.05} />

          {/* Scene Helpers */}
          <Grid
            position={[0, -0.1, 0]}
            args={[500, 50]}
            cellColor="#666"
            sectionColor="#333"
            fadeDistance={1000}
          />
          <axesHelper args={[50]} />

          {/* Render Pads */}
          {pads.map(pad => (
            <Pad3D
              key={pad.id}
              pad={pad}
              terrain={terrain}
              allPads={pads}
              isSelected={selectedPad && selectedPad.id === pad.id}
            />
          ))}

        </Suspense>
      </Canvas>
    </div>
  );
});

export default ThreeDView;
