import React from 'react';
import { FaLayerGroup, FaRulerCombined, FaMountain, FaTint, FaAtom, FaPlus, FaTrash } from 'react-icons/fa';

const Section = ({ title, icon, children }) => (
  <div className="panel-block">
    <div className="block-title">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const Input = ({ label, id, type = 'number', value, onChange, ...props }) => (
  <div className="input-group">
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} name={id} value={value} onChange={onChange} {...props} />
  </div>
);

const Select = ({ label, id, value, onChange, children, ...props }) => (
    <div className="input-group">
        {label && <label htmlFor={id}>{label}</label>}
        <select id={id} name={id} value={value} onChange={onChange} {...props}>
            {children}
        </select>
    </div>
);

const Sidebar = ({
  pads,
  selectedPad,
  addPad,
  deletePad,
  updatePad,
  setSelectedId,
  terrain,
  setTerrain
}) => {
  if (!selectedPad) return <div className="sidebar">Loading...</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updatePad(selectedPad.id, { [name]: parseFloat(value) || value });
  };

  const handleBoundsChange = (e) => {
    const { name, value } = e.target;
    const newBounds = { ...selectedPad.bounds, [name]: value };
    updatePad(selectedPad.id, { bounds: newBounds });
  };

  const handleTerrainChange = (e) => {
    const { name, value } = e.target;
    setTerrain(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="sidebar">
      <Section title="مدیریت پدها" icon={<FaLayerGroup />}>
        <Select
            id="padSelect"
            value={selectedPad.id}
            onChange={(e) => setSelectedId(parseInt(e.target.value))}
        >
            {pads.map(p => (
                <option key={p.id} value={p.id}>
                    {`[${p.lift}] ${p.name}`}
                </option>
            ))}
        </Select>
        <div className="pad-controls">
          <button className="btn-smart" onClick={() => addPad('right')}>
            <FaPlus /> راست
          </button>
          <button className="btn-smart" onClick={() => addPad('front')}>
            <FaPlus /> جلو
          </button>
          <button className="btn-smart" onClick={() => addPad('top')}>
            <FaPlus /> طبقه
          </button>
        </div>
        <button className="btn-delete" onClick={deletePad}>
          <FaTrash /> حذف پد
        </button>
      </Section>

      <Section title="هندسه و ابعاد" icon={<FaRulerCombined />}>
        <Input label="نام" id="name" type="text" value={selectedPad.name} onChange={handleInputChange} />
        <Input label="طبقه (Lift)" id="lift" value={selectedPad.lift} readOnly />
        <div className="input-row">
            <Input label="طول (L)" id="L" value={selectedPad.L} onChange={handleInputChange} />
            <Input label="عرض (W)" id="W" value={selectedPad.W} onChange={handleInputChange} />
            <Input label="ارتفاع (H)" id="H" value={selectedPad.H} onChange={handleInputChange} />
        </div>
        <div className="input-row">
            <Input label="X" id="x" value={selectedPad.x} onChange={handleInputChange} />
            <Input label="Z" id="z" value={selectedPad.z} onChange={handleInputChange} />
        </div>
      </Section>

      <Section title="شیب و دیواره‌ها" icon={<FaMountain />}>
        <div className="input-row">
            <Input label="شیب زمین X%" id="sx" name="sx" value={terrain.sx} onChange={handleTerrainChange} />
            <Input label="شیب زمین Y%" id="sy" name="sy" value={terrain.sy} onChange={handleTerrainChange} />
        </div>
        <Input label="شیب یال (°)" id="slopeDeg" value={selectedPad.slopeDeg} onChange={handleInputChange} />
        <div className="input-row">
            <Select id="L" name="L" value={selectedPad.bounds.L} onChange={handleBoundsChange}>
                <option value="free">چپ: شیب</option><option value="wall">چپ: دیوار</option><option value="attach">چپ: متصل</option>
            </Select>
            <Select id="R" name="R" value={selectedPad.bounds.R} onChange={handleBoundsChange}>
                <option value="free">راست: شیب</option><option value="wall">راست: دیوار</option><option value="attach">راست: متصل</option>
            </Select>
        </div>
        <div className="input-row">
            <Select id="F" name="F" value={selectedPad.bounds.F} onChange={handleBoundsChange}>
                <option value="free">جلو: شیب</option><option value="wall">جلو: دیوار</option><option value="attach">جلو: متصل</option>
            </Select>
            <Select id="B" name="B" value={selectedPad.bounds.B} onChange={handleBoundsChange}>
                <option value="free">پشت: شیب</option><option value="wall">پشت: دیوار</option><option value="attach">پشت: متصل</option>
            </Select>
        </div>
      </Section>

      <Section title="سیستم آبیاری" icon={<FaTint />}>
        <Input label="فلو امیتر (mL/min)" id="irrRate" value={selectedPad.irrRate} onChange={handleInputChange} />
        <div className="input-row">
            <Input label="فاصله لترال (cm)" id="lat" value={selectedPad.lat} onChange={handleInputChange} />
            <Input label="فاصله امیتر (cm)" id="emit" value={selectedPad.emit} onChange={handleInputChange} />
        </div>
      </Section>

      <Section title="پارامترهای متالورژی" icon={<FaAtom />}>
        <div className="input-row">
            <Input label="عیار Cu (%)" id="grade" value={selectedPad.grade} onChange={handleInputChange} step="0.1" />
            <Input label="بازیابی (%)" id="rec" value={selectedPad.rec} onChange={handleInputChange} step="0.1" />
            <Input label="دانسیته (t/m³)" id="dens" value={selectedPad.dens} onChange={handleInputChange} step="0.1" />
        </div>
      </Section>
    </div>
  );
};

export default Sidebar;
