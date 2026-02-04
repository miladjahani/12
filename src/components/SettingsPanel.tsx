import React from 'react';
import { Pad } from '../types';
import { usePads } from '../context/PadsContext';
import { Ruler, Mountain, Droplets, FlaskConical, Hash } from 'lucide-react';

const SettingsPanel: React.FC<{ pad: Pad }> = ({ pad }) => {
  const { updatePad, terrain, updateTerrain } = usePads();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === 'number') {
      val = parseFloat(value) || 0;
    }

    if (name === 'sx' || name === 'sy') {
      updateTerrain({ [name]: val });
    } else if (name.startsWith('bounds.')) {
      const field = name.split('.')[1] as keyof Pad['bounds'];
      updatePad({ ...pad, bounds: { ...pad.bounds, [field]: value } });
    } else {
      updatePad({ ...pad, [name]: val });
    }
  };

  const InputGroup = ({ label, icon: Icon, name, value, type = 'number', step = '1' }: any) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label className="text-xs text-telegram-text-muted flex items-center gap-1.5 px-1">
        <Icon size={14} />
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        step={step}
        onChange={handleChange}
        className="bg-telegram-sidebar border border-white/10 rounded-xl px-4 py-2.5 focus:border-telegram-accent outline-none transition-all text-sm"
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Geometry */}
      <div className="bg-telegram-sidebar/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="font-bold text-sm text-telegram-accent flex items-center gap-2">
          <Ruler size={16} /> هندسه و ابعاد
        </div>
        <div className="flex flex-col gap-4">
          <InputGroup label="نام پد" icon={Hash} name="name" value={pad.name} type="text" />
          <div className="flex gap-4">
            <InputGroup label="طول (L)" icon={Ruler} name="L" value={pad.L} />
            <InputGroup label="عرض (W)" icon={Ruler} name="W" value={pad.W} />
          </div>
          <div className="flex gap-4">
            <InputGroup label="ارتفاع (H)" icon={Ruler} name="H" value={pad.H} />
            <InputGroup label="شیب یال (°)" icon={Mountain} name="slopeDeg" value={pad.slopeDeg} />
          </div>
        </div>
      </div>

      {/* Terrain & Walls */}
      <div className="bg-telegram-sidebar/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="font-bold text-sm text-telegram-accent flex items-center gap-2">
          <Mountain size={16} /> زمین و دیواره‌ها
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <InputGroup label="شیب زمین X%" icon={Mountain} name="sx" value={terrain.sx} />
            <InputGroup label="شیب زمین Y%" icon={Mountain} name="sy" value={terrain.sy} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['L', 'R', 'F', 'B'].map((dir) => (
              <div key={dir} className="flex flex-col gap-1">
                <label className="text-[10px] text-telegram-text-muted px-1">دیوار {dir === 'L' ? 'چپ' : dir === 'R' ? 'راست' : dir === 'F' ? 'جلو' : 'عقب'}</label>
                <select
                  name={`bounds.${dir}`}
                  value={pad.bounds[dir as keyof Pad['bounds']]}
                  onChange={handleChange}
                  className="bg-telegram-sidebar border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-telegram-accent"
                >
                  <option value="free">شیب‌دار</option>
                  <option value="wall">دیواره عمودی</option>
                  <option value="attach">متصل به پد</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process & Irrigation */}
      <div className="bg-telegram-sidebar/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="font-bold text-sm text-telegram-accent flex items-center gap-2">
          <Droplets size={16} /> فرآیند و آبیاری
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <InputGroup label="عیار Cu (%)" icon={FlaskConical} name="grade" value={pad.grade} step="0.1" />
            <InputGroup label="بازیابی (%)" icon={FlaskConical} name="rec" value={pad.rec} step="1" />
          </div>
          <div className="flex gap-4">
            <InputGroup label="فاصله لترال (cm)" icon={Droplets} name="lat" value={pad.lat} />
            <InputGroup label="فاصله امیتر (cm)" icon={Droplets} name="emit" value={pad.emit} />
          </div>
          <InputGroup label="دبی امیتر (ml/min)" icon={Droplets} name="irrRate" value={pad.irrRate} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
