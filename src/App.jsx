import { useState, useMemo, useEffect, useRef } from 'react';
import { calculatePadStats } from './utils/calculations';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Header from './components/Header';
import Footer from './components/Footer';
import ThreeCanvas from './components/ThreeCanvas';
import Modal from './components/Modal';

function App() {
  const nextId = useRef(2);
  const [theme, setTheme] = useState('dark');
  const [pads, setPads] = useState([
    {
      id: 1,
      name: 'پد 1',
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
  ]);
  const [selectedId, setSelectedId] = useState(pads[0].id);
  const [terrain, setTerrain] = useState({ sx: -2, sy: 1 });
  const [is3DModalOpen, set3DModalOpen] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    document.body.className = theme === 'dark' ? '' : 'light-mode';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const selectedPad = useMemo(() => pads.find(p => p.id === selectedId), [pads, selectedId]);

  const stats = useMemo(() => {
    if (!selectedPad) return {};
    return calculatePadStats(selectedPad, pads, terrain);
  }, [selectedPad, pads, terrain]);

  const updatePad = (id, updatedProps) => {
    setPads(prevPads =>
      prevPads.map(p => (p.id === id ? { ...p, ...updatedProps } : p))
    );
  };

  const addPad = (mode) => {
    const ref = selectedPad;
    if (!ref) return;

    let newBounds = { L: 'free', R: 'free', F: 'free', B: 'free' };
    if (mode === 'right') newBounds.L = 'attach';
    else if (mode === 'front') newBounds.B = 'attach';

    const newPad = {
      ...ref,
      id: nextId.current++,
      name: '',
      bounds: newBounds,
    };

    if (mode === 'right') {
      newPad.x = ref.x + ref.L;
      newPad.z = ref.z;
      newPad.lift = 1;
      newPad.name = `${ref.name} - راست`;
      updatePad(ref.id, { bounds: { ...ref.bounds, R: 'attach' } });
    } else if (mode === 'front') {
      newPad.x = ref.x;
      newPad.z = ref.z + ref.W;
      newPad.lift = 1;
      newPad.name = `${ref.name} - جلو`;
      updatePad(ref.id, { bounds: { ...ref.bounds, F: 'attach' } });
    } else if (mode === 'top') {
      newPad.x = ref.x;
      newPad.z = ref.z;
      newPad.lift = ref.lift + 1;
      newPad.name = `طبقه ${newPad.lift} - ${ref.name}`;
    }

    setPads(prevPads => [...prevPads, newPad]);
    setSelectedId(newPad.id);
  };

  const handleDeleteRequest = () => {
    if (pads.length <= 1) {
        setModal({
            title: 'Error',
            message: 'At least one pad must exist.',
            onConfirm: () => setModal(null),
            confirmText: 'OK',
        });
        return;
    }

    setModal({
        title: 'Delete Pad',
        message: 'Are you sure you want to delete this pad?',
        onConfirm: () => {
            deletePad();
            setModal(null);
        },
        onCancel: () => setModal(null)
    });
  };

  const deletePad = () => {
    const padToDelete = selectedPad;

    let newPads = [...pads];

    newPads.forEach((p, index) => {
      if (p.id === padToDelete.id || p.lift !== padToDelete.lift) return;

      let updated = false;
      const updatedBounds = { ...p.bounds };

      if (p.x + p.L === padToDelete.x && p.z === padToDelete.z && p.bounds.R === 'attach') {
        updatedBounds.R = 'free';
        updated = true;
      }
      if (p.x === padToDelete.x + padToDelete.L && p.z === padToDelete.z && p.bounds.L === 'attach') {
        updatedBounds.L = 'free';
        updated = true;
      }
      if (p.x === padToDelete.x && p.z + p.W === padToDelete.z && p.bounds.F === 'attach') {
        updatedBounds.F = 'free';
        updated = true;
      }
      if (p.x === padToDelete.x && p.z === padToDelete.z + padToDelete.W && p.bounds.B === 'attach') {
        updatedBounds.B = 'free';
        updated = true;
      }

      if (updated) {
        newPads[index] = { ...p, bounds: updatedBounds };
      }
    });

    newPads = newPads.filter(p => p.id !== selectedId);

    setPads(newPads);
    setSelectedId(newPads.length > 0 ? newPads[newPads.length - 1].id : null);
  };

  return (
    <>
      {modal && <Modal {...modal} />}
      <Header theme={theme} toggleTheme={toggleTheme} pad={selectedPad} stats={stats} />
      <div className="dashboard">
        <Sidebar
          pads={pads}
          selectedPad={selectedPad}
          addPad={addPad}
          deletePad={handleDeleteRequest}
          updatePad={updatePad}
          setSelectedId={setSelectedId}
          terrain={terrain}
          setTerrain={setTerrain}
        />
        <MainContent stats={stats} pad={selectedPad} />
      </div>
      <Footer onOpen3D={() => set3DModalOpen(true)} />

      {is3DModalOpen && (
        <ThreeCanvas
          pads={pads}
          terrain={terrain}
          selectedId={selectedId}
          theme={theme}
          onClose={() => set3DModalOpen(false)}
        />
      )}
    </>
  );
}

export default App;
