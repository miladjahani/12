import React from 'react';
import { usePads } from '../context/PadsContext';
import { Plus, Trash2, Box, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Pad } from '../utils/heapCalculations';

const PadSidebar: React.FC = () => {
  const { pads, selectedPadId, setSelectedPadId, addPad, deletePad } = usePads();

  const handleAddNewPad = () => {
    const newPad: Pad = {
      id: `pad_${Date.now()}`,
      name: `پد جدید ${pads.length + 1}`,
      x: 0, z: 0, L: 200, W: 100, H: 15, lift: 1,
      slopeDeg: 37,
      bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
      lat: 50, emit: 40, irrRate: 80,
      grade: 0.7, rec: 80, dens: 1.7
    };
    addPad(newPad);
  };

  const handleAddBeside = (direction: 'right' | 'front') => {
    const selected = pads.find(p => p.id === selectedPadId);
    if (!selected) return;

    const newPad: Pad = {
      ...selected,
      id: `pad_${Date.now()}`,
      name: `${selected.name} (کپی)`,
      x: direction === 'right' ? selected.x + selected.L : selected.x,
      z: direction === 'front' ? selected.z + selected.W : selected.z,
    };
    addPad(newPad);
  };

  const handleAddTop = () => {
    const selected = pads.find(p => p.id === selectedPadId);
    if (!selected) return;

    const newPad: Pad = {
      ...selected,
      id: `pad_${Date.now()}`,
      name: `طبقه ${selected.lift + 1} - ${selected.name}`,
      lift: selected.lift + 1,
    };
    addPad(newPad);
  };

  return (
    <div className="w-80 bg-[--telegram-sidebar] border-l border-[--telegram-border] flex flex-col h-full shadow-xl">
      <div className="p-4 border-b border-[--telegram-border] flex justify-between items-center bg-[--telegram-sidebar]">
        <span className="font-bold text-lg">لیست پدها</span>
        <button
          onClick={handleAddNewPad}
          className="p-2 bg-[--telegram-active] rounded-full hover:bg-[#2075b8] transition-colors"
          title="افزودن پد جدید"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pads.map((pad) => (
          <motion.div
            key={pad.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedPadId(pad.id)}
            className={`p-4 cursor-pointer flex items-center gap-4 transition-colors border-b border-[--telegram-border]/50 ${
              selectedPadId === pad.id ? 'bg-[--telegram-active]' : 'hover:bg-[#1c2936]'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedPadId === pad.id ? 'bg-white/20' : 'bg-[--telegram-header]'
            }`}>
              <Box size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold truncate">{pad.name}</span>
                <span className="text-[10px] opacity-60">Lift {pad.lift}</span>
              </div>
              <div className="text-xs opacity-60 truncate">
                {pad.L} × {pad.W} × {pad.H} m
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPadId && (
        <div className="p-4 bg-[--telegram-sidebar] border-t border-[--telegram-border] space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAddBeside('right')} className="text-[10px] bg-[#2b3948] p-2 rounded flex flex-col items-center hover:bg-[#3a4a5a]">
              <Plus size={14} /> کنار (راست)
            </button>
            <button onClick={() => handleAddBeside('front')} className="text-[10px] bg-[#2b3948] p-2 rounded flex flex-col items-center hover:bg-[#3a4a5a]">
              <Plus size={14} /> کنار (جلو)
            </button>
            <button onClick={handleAddTop} className="text-[10px] bg-[#2b3948] p-2 rounded flex flex-col items-center hover:bg-[#3a4a5a]">
              <Layers size={14} /> طبقه بالا
            </button>
          </div>
          <button
            onClick={() => deletePad(selectedPadId)}
            className="w-full py-2 bg-red-900/40 text-red-300 rounded hover:bg-red-900/60 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 size={16} /> حذف پد
          </button>
        </div>
      )}
    </div>
  );
};

export default PadSidebar;
