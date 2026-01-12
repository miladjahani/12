import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Hud, Text } from '@react-three/drei';
import { usePads } from '../context/PadsContext';
import CustomPadMesh from './CustomPadMesh';
import { Terrain } from '../types';

interface Scene3DProps {
  onScreenshot: (dataUrl: string) => void;
}

const ScreenshotButton = ({ onScreenshot }: { onScreenshot: (dataUrl: string) => void }) => {
  const { gl, scene, camera } = useThree();

  const handleClick = () => {
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/png');
    onScreenshot(dataUrl);
    alert('تصویر برای گزارش ثبت شد!');
  };

  return (
    <Hud>
      <group position={[-300, -200, 0]}>
        <Text fontSize={12} color="white" position={[50, 0, 0]} anchorX="left">ثبت تصویر برای PDF</Text>
        <mesh onClick={handleClick} position={[0, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial color="royalblue" transparent opacity={0.8} />
        </mesh>
      </group>
    </Hud>
  );
};

const Scene3D = ({ onScreenshot }: Scene3DProps) => {
  const { pads } = usePads();
  const terrain: Terrain = { sx: -2, sy: 1 };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [300, 250, 400], fov: 45 }}>
        <color attach="background" args={['#0e1621']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[200, 500, 300]} intensity={1.5} />
        <Grid position={[0, -0.5, 0]} args={[1000, 1000]} infiniteGrid fadeDistance={2000} />
        {pads.map(pad => (
          <CustomPadMesh key={pad.id} pad={pad} terrain={terrain} />
        ))}
        <OrbitControls makeDefault />
        <ScreenshotButton onScreenshot={onScreenshot} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
