import React from 'react';
import { usePads } from '../context/PadsContext';
import { Ruler, Mountain, Droplets, FlaskConical, Target } from 'lucide-react';

const PadEditor: React.FC = () => {
  const { pads, selectedPadId, updatePad, terrain, setTerrain } = usePads();
  const pad = pads.find(p => p.id === selectedPadId);

  if (!pad) return <div className="p-6 bg-[#182533] rounded-2xl border border-[--telegram-border] text-center text-[--telegram-muted]">پدی انتخاب نشده است</div>;

  const handleInputChange = (field: string, value: any) => {
    updatePad({ ...pad, [field]: value });
  };

  const handleBoundsChange = (side: string, value: any) => {
    updatePad({ ...pad, bounds: { ...pad.bounds, [side]: value } });
  };

  const InputField = ({ label, value, onChange, icon: Icon, type = "number", step = "1" }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[--telegram-muted] flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        className="bg-[#242f3d] border border-[--telegram-border] rounded-lg p-2 text-sm focus:border-[--telegram-active] outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="p-6 bg-[#182533] rounded-2xl border border-[--telegram-border] space-y-6 shadow-lg">
      <div className="flex items-center gap-2 border-b border-[--telegram-border] pb-3">
        <Ruler className="text-[--telegram-active]" />
        <h2 className="font-bold">ویرایش مشخصات: {pad.name}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <InputField label="نام پد" type="text" value={pad.name} onChange={(v: string) => handleInputChange('name', v)} />
        <InputField label="طول (L)" value={pad.L} onChange={(v: number) => handleInputChange('L', v)} />
        <InputField label="عرض (W)" value={pad.W} onChange={(v: number) => handleInputChange('W', v)} />
        <InputField label="ارتفاع (H)" value={pad.H} onChange={(v: number) => handleInputChange('H', v)} />
        <InputField label="موقعیت X" value={pad.x} onChange={(v: number) => handleInputChange('x', v)} />
        <InputField label="موقعیت Z" value={pad.z} onChange={(v: number) => handleInputChange('z', v)} />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold flex items-center gap-2"><Mountain size={16} /> شیب و زمین</label>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="شیب زمین X %" value={terrain.sx} onChange={(v: number) => setTerrain({ ...terrain, sx: v })} />
          <InputField label="شیب زمین Z %" value={terrain.sy} onChange={(v: number) => setTerrain({ ...terrain, sy: v })} />
          <InputField label="شیب یال (°)" value={pad.slopeDeg} onChange={(v: number) => handleInputChange('slopeDeg', v)} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold flex items-center gap-2">نوع دیواره‌ها</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['L', 'R', 'F', 'B'] as const).map(side => (
            <div key={side} className="flex flex-col gap-1">
              <label className="text-[10px] text-[--telegram-muted]">دیواره {side}</label>
              <select
                value={pad.bounds[side]}
                onChange={(e) => handleBoundsChange(side, e.target.value)}
                className="bg-[#242f3d] border border-[--telegram-border] rounded-lg p-2 text-xs outline-none"
              >
                <option value="free">شیب‌دار</option>
                <option value="wall">دیوار قائم</option>
                <option value="attach">متصل</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2"><Droplets size={16} /> سیستم آبیاری</label>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="لترال (cm)" value={pad.lat} onChange={(v: number) => handleInputChange('lat', v)} />
            <InputField label="امیتر (cm)" value={pad.emit} onChange={(v: number) => handleInputChange('emit', v)} />
            <InputField label="دبی (mL/min)" value={pad.irrRate} onChange={(v: number) => handleInputChange('irrRate', v)} />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2"><FlaskConical size={16} /> متالورژی</label>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="عیار Cu %" step="0.01" value={pad.grade} onChange={(v: number) => handleInputChange('grade', v)} />
            <InputField label="بازیابی %" step="0.1" value={pad.rec} onChange={(v: number) => handleInputChange('rec', v)} />
            <InputField label="دانسیته t/m3" step="0.01" value={pad.dens} onChange={(v: number) => handleInputChange('dens', v)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PadEditor;
