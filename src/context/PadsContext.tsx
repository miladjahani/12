import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pad, Terrain } from '../types';

interface PadsContextType {
  pads: Pad[];
  selectedId: string | null;
  terrain: Terrain;
  addPad: (mode: 'right' | 'front' | 'top') => void;
  updatePad: (pad: Pad) => void;
  deletePad: (id: string) => void;
  selectPad: (id: string | null) => void;
  updateTerrain: (terrain: Partial<Terrain>) => void;
}

const defaultPad: Pad = {
  id: 'pad_initial',
  name: 'پد ۱',
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
};

const PadsContext = createContext<PadsContextType | undefined>(undefined);

export const PadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pads, setPads] = useState<Pad[]>([defaultPad]);
  const [selectedId, setSelectedId] = useState<string | null>(defaultPad.id);
  const [terrain, setTerrain] = useState<Terrain>({ sx: -2, sy: 1 });

  const addPad = (mode: 'right' | 'front' | 'top') => {
    if (!selectedId) return;
    const ref = pads.find((p) => p.id === selectedId);
    if (!ref) return;

    const newId = `pad_${Date.now()}`;
    let newPad: Pad = { ...ref, id: newId, name: `${ref.name} (کپی)` };

    const updatedPads = [...pads];
    const refIdx = updatedPads.findIndex(p => p.id === ref.id);

    switch (mode) {
      case 'right':
        newPad.x = ref.x + ref.L;
        newPad.bounds.L = 'attach';
        updatedPads[refIdx] = { ...ref, bounds: { ...ref.bounds, R: 'attach' } };
        break;
      case 'front':
        newPad.z = ref.z + ref.W;
        newPad.bounds.B = 'attach';
        updatedPads[refIdx] = { ...ref, bounds: { ...ref.bounds, F: 'attach' } };
        break;
      case 'top':
        newPad.lift = ref.lift + 1;
        newPad.name = `طبقه‌ ${newPad.lift} - ${ref.name}`;
        break;
    }

    setPads([...updatedPads, newPad]);
    setSelectedId(newId);
  };

  const updatePad = (pad: Pad) => {
    setPads((prev) => prev.map((p) => (p.id === pad.id ? pad : p)));
  };

  const deletePad = (id: string) => {
    if (pads.length <= 1) return;
    const newPads = pads.filter((p) => p.id !== id);
    setPads(newPads);
    if (selectedId === id) {
      setSelectedId(newPads[newPads.length - 1].id);
    }
  };

  const selectPad = (id: string | null) => {
    setSelectedId(id);
  };

  const updateTerrain = (t: Partial<Terrain>) => {
    setTerrain((prev) => ({ ...prev, ...t }));
  };

  return (
    <PadsContext.Provider
      value={{
        pads,
        selectedId,
        terrain,
        addPad,
        updatePad,
        deletePad,
        selectPad,
        updateTerrain,
      }}
    >
      {children}
    </PadsContext.Provider>
  );
};

export const usePads = () => {
  const context = useContext(PadsContext);
  if (context === undefined) {
    throw new Error('usePads must be used within a PadsProvider');
  }
  return context;
};
