import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pad, Terrain } from '../utils/heapCalculations';

interface PadsContextType {
  pads: Pad[];
  selectedPadId: string | null;
  terrain: Terrain;
  setSelectedPadId: (id: string | null) => void;
  setTerrain: (t: Terrain) => void;
  addPad: (pad: Pad) => void;
  updatePad: (pad: Pad) => void;
  deletePad: (id: string) => void;
}

const PadsContext = createContext<PadsContextType | undefined>(undefined);

export const PadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pads, setPads] = useState<Pad[]>([]);
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<Terrain>({ sx: -2, sy: 1 });

  useEffect(() => {
    // Initial Pad
    const initialPad: Pad = {
      id: `pad_${Date.now()}`,
      name: 'پد ۱',
      x: 0, z: 0, L: 200, W: 100, H: 15, lift: 1,
      slopeDeg: 37,
      bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
      lat: 50, emit: 40, irrRate: 80,
      grade: 0.7, rec: 80, dens: 1.7
    };
    setPads([initialPad]);
    setSelectedPadId(initialPad.id);
  }, []);

  const addPad = (pad: Pad) => {
    setPads(prev => [...prev, pad]);
    setSelectedPadId(pad.id);
  };

  const updatePad = (updatedPad: Pad) => {
    setPads(prev => prev.map(p => p.id === updatedPad.id ? updatedPad : p));
  };

  const deletePad = (id: string) => {
    setPads(prev => prev.filter(p => p.id !== id));
    if (selectedPadId === id) setSelectedPadId(null);
  };

  return (
    <PadsContext.Provider value={{ pads, selectedPadId, terrain, setSelectedPadId, setTerrain, addPad, updatePad, deletePad }}>
      {children}
    </PadsContext.Provider>
  );
};

export const usePads = () => {
  const context = useContext(PadsContext);
  if (!context) throw new Error('usePads must be used within a PadsProvider');
  return context;
};
