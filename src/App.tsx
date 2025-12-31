import { useState, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Results from './components/Results';
import Canvas3D from './components/Canvas3D';
import Header from './components/Header';
import { Pad, Terrain, CalculationResults } from './utils/types';
import { calculatePadStats } from './utils/calculations';

const initialPads: Pad[] = [
  {
    id: 1,
    name: 'Main Pad',
    x: 0,
    z: 0,
    L: 200,
    W: 100,
    H: 15,
    lift: 1,
    slopeDeg: 37,
    bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
    lat: 50,
    emit: 40,
    irrRate: 80,
    grade: 0.7,
    rec: 80,
    dens: 1.7,
  },
];

function App() {
  const [pads, setPads] = useState<Pad[]>(initialPads);
  const [selectedPadId, setSelectedPadId] = useState<number | null>(1);
  const [terrain, setTerrain] = useState<Terrain>({ sx: -2, sy: 1 });
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const addPad = (mode: 'right' | 'front' | 'top') => {
    const ref = pads.find(p => p.id === selectedPadId);
    if (!ref) return;

    const newPad: Pad = {
      ...ref,
      id: Date.now(),
      name: `Pad ${pads.length + 1}`,
      lift: mode === 'top' ? ref.lift + 1 : 1,
      x: mode === 'right' ? ref.x + ref.L : ref.x,
      z: mode === 'front' ? ref.z + ref.W : ref.z,
      bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
    };

    if (mode === 'right') newPad.bounds.L = 'attach';
    if (mode === 'front') newPad.bounds.B = 'attach';
    
    setPads([...pads, newPad]);
    setSelectedPadId(newPad.id);
  };

  const deletePad = () => {
    if (pads.length <= 1) return;
    const newPads = pads.filter(p => p.id !== selectedPadId);
    setPads(newPads);
    setSelectedPadId(newPads[0]?.id || null);
  };

  const selectedPad = useMemo(() => {
    return pads.find(p => p.id === selectedPadId) || null;
  }, [pads, selectedPadId]);

  const results: CalculationResults | null = useMemo(() => {
    if (!selectedPad) return null;
    return calculatePadStats(selectedPad, pads, terrain);
  }, [selectedPad, pads, terrain]);

  return (
    <div className="bg-tg-bg text-tg-text min-h-screen flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          pads={pads}
          selectedPad={selectedPad}
          results={results}
          terrain={terrain}
          setPads={setPads}
          setSelectedPadId={setSelectedPadId}
          setTerrain={setTerrain}
          glRef={glRef}
          addPad={addPad}
          deletePad={deletePad}
        />
        <main className="flex-1 flex flex-col">
          {results && <Results results={results} />}
          <div className="flex-1 bg-tg-secondary-bg border-t border-gray-700">
            <Canvas3D pads={pads} selectedPad={selectedPad} terrain={terrain} glRef={glRef} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;