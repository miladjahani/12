import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ThreeDView from './components/ThreeDView/ThreeDView';
import { calculatePadStats } from './utils/calculations';
import { exportToPdf } from './utils/pdfExport';
import './index.css';

function App() {
  const [pads, setPads] = useState([]);
  const [selectedPadId, setSelectedPadId] = useState(null);
  const [terrain, setTerrain] = useState({ sx: -2, sy: 1 });
  const [calculatedStats, setCalculatedStats] = useState(null);
  const threeDCanvasRef = useRef();

  // Initialize with a default pad
  useEffect(() => {
    const initialPad = {
      id: Date.now(),
      name: 'Default Pad',
      x: 0, z: 0,
      L: 200, W: 100, H: 15,
      lift: 1,
      slopeDeg: 37,
      bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
      lat: 50, emit: 40,
      irrRate: 80,
      grade: 0.7,
      rec: 80,
      dens: 1.7
    };
    setPads([initialPad]);
    setSelectedPadId(initialPad.id);
  }, []);

  const selectedPad = pads.find(p => p.id === selectedPadId);

  // Recalculate stats when selected pad or its properties change
  useEffect(() => {
    if (selectedPad) {
      const stats = calculatePadStats(selectedPad, terrain, pads);
      setCalculatedStats(stats);
    }
  }, [selectedPad, pads, terrain]);

  const handleUpdatePad = (updatedPad) => {
    setPads(prevPads => prevPads.map(p => p.id === updatedPad.id ? updatedPad : p));
  };

  const handleSelectPad = (id) => {
    setSelectedPadId(id);
  };

  const handleAddPad = (mode) => {
    if (!selectedPad) return;
    const ref = selectedPad;

    let newPadProps = { ...ref, id: Date.now(), name: '' };
    let updatedRefBounds = { ...ref.bounds };

    if (mode === 'right') {
        newPadProps.x = ref.x + ref.L;
        newPadProps.bounds.L = 'attach';
        updatedRefBounds.R = 'attach';
        newPadProps.name = `${ref.name} - Right`;
    } else if (mode === 'front') {
        newPadProps.z = ref.z + ref.W;
        newPadProps.bounds.B = 'attach';
        updatedRefBounds.F = 'attach';
        newPadProps.name = `${ref.name} - Front`;
    } else if (mode === 'top') {
        newPadProps.lift = ref.lift + 1;
        newPadProps.H = ref.H * newPadProps.lift; // Simple height increase
        newPadProps.name = `Lift ${newPadProps.lift} - ${ref.name}`;
    }

    const updatedPads = pads.map(p => p.id === ref.id ? { ...p, bounds: updatedRefBounds } : p);

    setPads([...updatedPads, newPadProps]);
    setSelectedPadId(newPadProps.id);
  };

  const handleDeletePad = () => {
    if (pads.length <= 1) {
        alert("Cannot delete the last remaining pad.");
        return;
    }
    if (window.confirm("Are you sure you want to delete this pad?")) {
        const newPads = pads.filter(p => p.id !== selectedPadId);
        // A real implementation would also update adjacent pad boundaries
        setPads(newPads);
        setSelectedPadId(newPads[0]?.id || null);
    }
  };

  const handleExportPdf = () => {
    if (threeDCanvasRef.current && calculatedStats && selectedPad) {
        const canvas = threeDCanvasRef.current.querySelector('canvas');
        if (canvas) {
            exportToPdf(canvas, calculatedStats, selectedPad);
        }
    }
  };

  return (
    <div className="app-container">
      <Header onExportPdf={handleExportPdf} />
      <div className="main-layout">
        <Sidebar
          pads={pads}
          selectedPad={selectedPad}
          onUpdatePad={handleUpdatePad}
          onSelectPad={handleSelectPad}
          onAddPad={handleAddPad}
          onDeletePad={handleDeletePad}
        />
        <div className="content-container">
            <MainContent
              selectedPad={selectedPad}
              stats={calculatedStats}
            />
            <ThreeDView
              ref={threeDCanvasRef}
              pads={pads}
              selectedPad={selectedPad}
              terrain={terrain}
            />
        </div>
      </div>
    </div>
  );
}

export default App;
