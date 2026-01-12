import { usePads } from '../context/PadsContext';
import InputField from './InputField';
import { ChangeEvent } from 'react';

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-[#212b36] p-3 rounded-lg">
    <h2 className="text-white font-bold text-sm mb-3 border-b border-gray-600 pb-2">{title}</h2>
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  const { pads, selectedPadId, selectPad, updatePad } = usePads();
  const selectedPad = pads.find(p => p.id === selectedPadId);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedPad) return;
    const { name, value } = e.target;
    const isNumber = e.target.getAttribute('type') === 'number';

    // Handle nested bounds object
    if (['L', 'R', 'F', 'B'].includes(name)) {
      updatePad({ ...selectedPad, bounds: { ...selectedPad.bounds, [name]: value } });
    } else {
      updatePad({ ...selectedPad, [name]: isNumber ? parseFloat(value) : value });
    }
  };

  return (
    <aside className="bg-[#17212b] w-96 border-l border-gray-700 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="bg-[#212b36] p-3 rounded-lg">
        <h2 className="text-white font-bold text-sm mb-2">مدیریت پدها</h2>
        <select
          className="w-full bg-[#2c3a4a] text-white border border-gray-600 rounded p-2 text-sm"
          value={selectedPadId || ''}
          onChange={(e) => selectPad(e.target.value)}
        >
          {pads.map(pad => (
            <option key={pad.id} value={pad.id}>{pad.name}</option>
          ))}
        </select>
        {/* Pad add/delete buttons are now in PadManager */}
      </div>

      {selectedPad && (
        <>
          <SidebarSection title="هندسه و ابعاد">
            <InputField label="نام" id="name" type="text" value={selectedPad.name} onChange={handleChange} />
            <InputField label="طبقه" id="lift" value={selectedPad.lift} onChange={() => {}} />
            <InputField label="طول (L)" id="L" value={selectedPad.L} onChange={handleChange} />
            <InputField label="عرض (W)" id="W" value={selectedPad.W} onChange={handleChange} />
            <InputField label="ارتفاع (H)" id="H" value={selectedPad.H} onChange={handleChange} />
            <InputField label="شیب یال (°)" id="slopeDeg" value={selectedPad.slopeDeg} onChange={handleChange} />
            <InputField label="X" id="x" value={selectedPad.x} onChange={handleChange} />
            <InputField label="Z" id="z" value={selectedPad.z} onChange={handleChange} />
          </SidebarSection>

          <SidebarSection title="پارامترهای متالورژی">
            <InputField label="عیار Cu (%)" id="grade" value={selectedPad.grade} step={0.1} onChange={handleChange} />
            <InputField label="بازیابی (%)" id="rec" value={selectedPad.rec} step={0.1} onChange={handleChange} />
            <InputField label="دانسیته (t/m³)" id="dens" value={selectedPad.dens} step={0.1} onChange={handleChange} />
          </SidebarSection>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
