import { createContext, useContext, useState, ReactNode } from 'react';
import { Pad } from '../types';

// Define the shape of the context state
interface PadsContextState {
  pads: Pad[];
  selectedPadId: string | null;
  addPad: (mode: 'right' | 'front' | 'top') => void;
  deletePad: () => void;
  selectPad: (id: string) => void;
  updatePad: (updatedPad: Pad) => void;
}

// Create the context
const PadsContext = createContext<PadsContextState | undefined>(undefined);

// Initial data for the first pad
const initialPad: Pad = {
  id: `pad_${Date.now()}`,
  name: `پد ۱`,
  x: 0, z: 0, L: 200, W: 100, H: 15, lift: 1,
  slopeDeg: 37,
  bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
  grade: 0.7, rec: 80, dens: 1.7,
  irrRate: 80, lat: 50, emit: 40
};

// Create the provider component
export const PadsProvider = ({ children }: { children: ReactNode }) => {
  const [pads, setPads] = useState<Pad[]>([initialPad]);
  const [selectedPadId, setSelectedPadId] = useState<string | null>(initialPad.id);

  const selectedPad = pads.find(p => p.id === selectedPadId);

  const addPad = (mode: 'right' | 'front' | 'top') => {
    if (!selectedPad) return;

    const newPad: Pad = {
      ...selectedPad,
      id: `pad_${Date.now()}`,
      name: `${selectedPad.name} (کپی)`,
    };

    switch (mode) {
      case 'right':
        newPad.x = selectedPad.x + selectedPad.L;
        newPad.z = selectedPad.z;
        newPad.bounds.L = 'attach';
        // Also update the original pad
        updatePad({ ...selectedPad, bounds: { ...selectedPad.bounds, R: 'attach' } });
        break;
      case 'front':
        newPad.x = selectedPad.x;
        newPad.z = selectedPad.z + selectedPad.W;
        newPad.bounds.B = 'attach';
        updatePad({ ...selectedPad, bounds: { ...selectedPad.bounds, F: 'attach' } });
        break;
      case 'top':
        newPad.x = selectedPad.x;
        newPad.z = selectedPad.z;
        newPad.lift = selectedPad.lift + 1;
        newPad.name = `طبقه ${newPad.lift} - ${selectedPad.name}`;
        break;
    }

    const newPads = [...pads, newPad];
    setPads(newPads);
    setSelectedPadId(newPad.id);
  };

  const deletePad = () => {
    if (pads.length <= 1 || !selectedPadId) return;
    const newPads = pads.filter(p => p.id !== selectedPadId);
    setPads(newPads);
    setSelectedPadId(newPads.length > 0 ? newPads[0].id : null);
  };

  const updatePad = (updatedPad: Pad) => {
    const newPads = pads.map(p => p.id === updatedPad.id ? updatedPad : p);
    setPads(newPads);
  };

  const value = {
    pads,
    selectedPadId,
    addPad,
    deletePad,
    selectPad: setSelectedPadId,
    updatePad,
  };

  return <PadsContext.Provider value={value}>{children}</PadsContext.Provider>;
};

// Custom hook to use the pads context
export const usePads = () => {
  const context = useContext(PadsContext);
  if (context === undefined) {
    throw new Error('usePads must be used within a PadsProvider');
  }
  return context;
};
