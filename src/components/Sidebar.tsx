import React from 'react';
import { FaPlus, FaTrash, FaArrowRight, FaArrowDown, FaLayerGroup, FaFilePdf } from 'react-icons/fa';
import { Pad, Terrain, CalculationResults } from '../utils/types';
import { exportToPDF } from '../utils/pdfExport';

interface SidebarProps {
  pads: Pad[];
  selectedPad: Pad | null;
  results: CalculationResults | null;
  terrain: Terrain;
  setPads: React.Dispatch<React.SetStateAction<Pad[]>>;
  setSelectedPadId: React.Dispatch<React.SetStateAction<number | null>>;
  setTerrain: React.Dispatch<React.SetStateAction<Terrain>>;
  glRef: React.RefObject<THREE.WebGLRenderer | null>;
  addPad: (mode: 'right' | 'front' | 'top') => void;
  deletePad: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ pads, selectedPad, results, terrain, setPads, setSelectedPadId, setTerrain, glRef, addPad, deletePad }) => {

  const handlePadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedPad) return;
    const { name, value } = e.target;
    const updatedPad = { ...selectedPad, [name]: name === 'name' ? value : parseFloat(value) };
    const newPads = pads.map(p => (p.id === selectedPad.id ? updatedPad : p));
    setPads(newPads);
  };

  const handleBoundsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedPad) return;
    const { name, value } = e.target;
    const updatedPad = {
      ...selectedPad,
      bounds: { ...selectedPad.bounds, [name]: value as 'free' | 'wall' | 'attach' },
    };
    const newPads = pads.map(p => (p.id === selectedPad.id ? updatedPad : p));
    setPads(newPads);
  };

  const handleTerrainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTerrain(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <aside className="w-96 bg-tg-secondary-bg border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
      {/* Pad Management */}
      <div className="p-3 bg-tg-bg rounded-lg">
        <h3 className="text-md font-semibold text-tg-text mb-2">Pad Management</h3>
        <select
          value={selectedPad?.id || ''}
          onChange={(e) => setSelectedPadId(parseInt(e.target.value))}
          className="w-full p-2 bg-tg-secondary-bg text-tg-text border border-gray-600 rounded-md text-sm"
        >
          {pads.map(p => <option key={p.id} value={p.id}>{`[${p.lift}] ${p.name}`}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button onClick={() => addPad('right')} className="p-2 bg-tg-primary hover:bg-blue-700 rounded-md flex items-center justify-center"><FaArrowRight /></button>
          <button onClick={() => addPad('front')} className="p-2 bg-tg-primary hover:bg-blue-700 rounded-md flex items-center justify-center"><FaArrowDown /></button>
          <button onClick={() => addPad('top')} className="p-2 bg-tg-primary hover:bg-blue-700 rounded-md flex items-center justify-center"><FaLayerGroup /></button>
        </div>
        <button onClick={deletePad} className="w-full mt-2 p-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center justify-center space-x-2 text-sm">
          <FaTrash /><span>Delete Selected</span>
        </button>
      </div>

        {selectedPad && results && (
        <>
            <div className="p-3 bg-tg-bg rounded-lg">
              <button
                onClick={() => {
                  if (glRef.current) {
                    const canvas = glRef.current.domElement;
                    const dataURL = canvas.toDataURL('image/png');
                    exportToPDF(selectedPad, results, dataURL);
                  }
                }}
                className="w-full p-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center justify-center space-x-2 text-sm"
              >
                <FaFilePdf /><span>Export to PDF</span>
              </button>
            </div>
          {/* Dimensions & Geometry */}
          <div className="p-3 bg-tg-bg rounded-lg space-y-2">
            <h3 className="text-md font-semibold text-tg-text">Dimensions & Geometry</h3>
            <input name="name" value={selectedPad.name} onChange={handlePadChange} placeholder="Pad Name" className="w-full p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input name="L" type="number" value={selectedPad.L} onChange={handlePadChange} placeholder="Length" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
              <input name="W" type="number" value={selectedPad.W} onChange={handlePadChange} placeholder="Width" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
              <input name="H" type="number" value={selectedPad.H} onChange={handlePadChange} placeholder="Height" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
            </div>
             <div className="grid grid-cols-2 gap-2">
                <input name="x" type="number" value={selectedPad.x} onChange={handlePadChange} placeholder="Start X" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
                <input name="z" type="number" value={selectedPad.z} onChange={handlePadChange} placeholder="Start Z" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
            </div>
          </div>

          {/* Slopes & Boundaries */}
          <div className="p-3 bg-tg-bg rounded-lg space-y-2">
            <h3 className="text-md font-semibold text-tg-text">Slopes & Boundaries</h3>
            <div className="grid grid-cols-3 gap-2">
              <input name="slopeDeg" type="number" value={selectedPad.slopeDeg} onChange={handlePadChange} placeholder="Side Slope (°)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm col-span-1" />
              <input name="sx" type="number" value={terrain.sx} onChange={handleTerrainChange} placeholder="Terrain X (%)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
              <input name="sy" type="number" value={terrain.sy} onChange={handleTerrainChange} placeholder="Terrain Y (%)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select name="L" value={selectedPad.bounds.L} onChange={handleBoundsChange} className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm"><option value="free">Left: Free</option><option value="wall">Left: Wall</option><option value="attach">Left: Attach</option></select>
              <select name="R" value={selectedPad.bounds.R} onChange={handleBoundsChange} className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm"><option value="free">Right: Free</option><option value="wall">Right: Wall</option><option value="attach">Right: Attach</option></select>
              <select name="F" value={selectedPad.bounds.F} onChange={handleBoundsChange} className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm"><option value="free">Front: Free</option><option value="wall">Front: Wall</option><option value="attach">Front: Attach</option></select>
              <select name="B" value={selectedPad.bounds.B} onChange={handleBoundsChange} className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm"><option value="free">Back: Free</option><option value="wall">Back: Wall</option><option value="attach">Back: Attach</option></select>
            </div>
          </div>

          {/* Irrigation */}
          <div className="p-3 bg-tg-bg rounded-lg space-y-2">
             <h3 className="text-md font-semibold text-tg-text">Irrigation</h3>
             <div className="grid grid-cols-3 gap-2">
                <input name="irrRate" type="number" value={selectedPad.irrRate} onChange={handlePadChange} placeholder="Flow (mL/min)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
                <input name="lat" type="number" value={selectedPad.lat} onChange={handlePadChange} placeholder="Lateral (cm)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
                <input name="emit" type="number" value={selectedPad.emit} onChange={handlePadChange} placeholder="Emitter (cm)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
             </div>
          </div>

          {/* Metallurgy */}
          <div className="p-3 bg-tg-bg rounded-lg space-y-2">
             <h3 className="text-md font-semibold text-tg-text">Metallurgy</h3>
             <div className="grid grid-cols-3 gap-2">
                <input name="grade" type="number" value={selectedPad.grade} onChange={handlePadChange} placeholder="Grade (%)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
                <input name="rec" type="number" value={selectedPad.rec} onChange={handlePadChange} placeholder="Recovery (%)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
                <input name="dens" type="number" value={selectedPad.dens} onChange={handlePadChange} placeholder="Density (t/m³)" className="p-2 bg-tg-secondary-bg border border-gray-600 rounded-md text-sm" />
             </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;