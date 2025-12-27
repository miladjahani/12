import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import Pad from './Pad';
import Ground from './Ground';

const ThreeCanvas = ({ pads, terrain, selectedId, theme, onClose }) => {
  const sceneBackgroundColor = theme === 'dark' ? '#0f172a' : '#f8fafc';

  return (
    <div className="modal-3d" style={{ transform: 'translateY(0)' }}>
        <div className="modal-bar">
            <div className="modal-title">نمای سه‌بعدی سایت</div>
            <button className="btn-close" onClick={onClose}>
                &times;
            </button>
        </div>
        <div id="canvas-wrapper">
            <Canvas camera={{ position: [300, 250, 400], fov: 45 }} shadows>
                <Suspense fallback={null}>
                    <color attach="background" args={[sceneBackgroundColor]} />

                    <ambientLight intensity={theme === 'dark' ? 0.5 : 0.3} />
                    <directionalLight
                        position={[200, 500, 200]}
                        intensity={theme === 'dark' ? 0.8 : 0.6}
                        castShadow
                    />

                    <Ground terrain={terrain} />

                    {pads.map(pad => (
                        <Pad
                            key={pad.id}
                            pad={pad}
                            allPads={pads}
                            terrain={terrain}
                            isSelected={pad.id === selectedId}
                        />
                    ))}

                    <Grid
                        position={[0, -0.1, 0]}
                        args={[1000, 100]}
                        cellColor={theme === 'dark' ? '#666' : '#ccc'}
                        sectionColor={theme === 'dark' ? '#333' : '#aaa'}
                        fadeDistance={2000}
                        infiniteGrid
                    />

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        maxPolarAngle={Math.PI / 2 - 0.05}
                    />
                </Suspense>
            </Canvas>
        </div>
    </div>
  );
};

export default ThreeCanvas;
