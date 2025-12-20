import React from 'react';
import {
    FaPlus, FaTrash, FaArrowRight, FaArrowDown, FaLayerGroup, FaRulerCombined,
    FaMountain, FaTint, FaAtom, FaTag, FaArrowsAltH, FaArrowsAltV, FaSortAmountUp, FaAngleDoubleRight
} from 'react-icons/fa';

const IconInput = ({ id, label, value, onChange, type = "number", step, icon }) => (
    <div className="input-group">
        <label htmlFor={id}>{icon} {label}</label>
        <input type={type} id={id} value={value} onChange={onChange} step={step} />
    </div>
);

const Sidebar = ({ pads, selectedPad, onUpdatePad, onSelectPad, onAddPad, onDeletePad }) => {
  if (!selectedPad) {
    return <aside className="sidebar">Loading pad data...</aside>;
  }

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    const isNumber = type === 'number';
    let newPad = { ...selectedPad };

    if (id.startsWith('bound')) {
        const boundaryKey = id.replace('bound', '');
        newPad.bounds = { ...newPad.bounds, [boundaryKey]: value };
    } else {
        newPad[id] = isNumber ? parseFloat(value) : value;
    }

    onUpdatePad(newPad);
  };

  const handlePadSelection = (e) => {
    onSelectPad(parseInt(e.target.value));
  };

  return (
    <aside className="sidebar">
      <div className="panel-block">
        <h3 className="panel-title"><FaLayerGroup /> Pad Management</h3>
        <div className="input-group">
          <select onChange={handlePadSelection} value={selectedPad.id}>
            {pads.map(pad => (
              <option key={pad.id} value={pad.id}>
                {pad.name}
              </option>
            ))}
          </select>
        </div>
        <div className="pad-controls">
            <button className="btn-smart" onClick={() => onAddPad('right')}><FaArrowRight /> Add Right</button>
            <button className="btn-smart" onClick={() => onAddPad('front')}><FaArrowDown /> Add Front</button>
            <button className="btn-smart" onClick={() => onAddPad('top')}><FaLayerGroup /> Add Top</button>
        </div>
        <button className="btn-delete" onClick={onDeletePad}><FaTrash /> Delete Selected Pad</button>
      </div>

      <div className="panel-block">
        <h3 className="panel-title"><FaRulerCombined /> Geometry & Dimensions</h3>
        <IconInput id="name" label="Name" value={selectedPad.name} onChange={handleInputChange} type="text" icon={<FaTag />} />
        <div className="input-row">
            <IconInput id="L" label="Length (L)" value={selectedPad.L} onChange={handleInputChange} icon={<FaArrowsAltH />} />
            <IconInput id="W" label="Width (W)" value={selectedPad.W} onChange={handleInputChange} icon={<FaArrowsAltV />} />
            <IconInput id="H" label="Height (H)" value={selectedPad.H} onChange={handleInputChange} icon={<FaSortAmountUp />} />
        </div>
      </div>

      <div className="panel-block">
        <h3 className="panel-title"><FaMountain /> Slope & Boundaries</h3>
        <IconInput id="slopeDeg" label="Slope Angle (°)" value={selectedPad.slopeDeg} onChange={handleInputChange} icon={<FaAngleDoubleRight />} />
        <div className="input-group">
            <label>Boundary Types</label>
            <div className="boundary-grid">
                <select id="boundL" value={selectedPad.bounds.L} onChange={handleInputChange}><option value="free">Left: Free</option><option value="wall">Left: Wall</option><option value="attach">Left: Attach</option></select>
                <select id="boundR" value={selectedPad.bounds.R} onChange={handleInputChange}><option value="free">Right: Free</option><option value="wall">Right: Wall</option><option value="attach">Right: Attach</option></select>
                <select id="boundF" value={selectedPad.bounds.F} onChange={handleInputChange}><option value="free">Front: Free</option><option value="wall">Front: Wall</option><option value="attach">Front: Attach</option></select>
                <select id="boundB" value={selectedPad.bounds.B} onChange={handleInputChange}><option value="free">Back: Free</option><option value="wall">Back: Wall</option><option value="attach">Back: Attach</option></select>
            </div>
        </div>
      </div>

      <div className="panel-block">
        <h3 className="panel-title"><FaAtom /> Metallurgy</h3>
        <div className="input-row">
            <IconInput id="grade" label="Grade (%)" value={selectedPad.grade} onChange={handleInputChange} step="0.1" icon={<FaPlus />} />
            <IconInput id="rec" label="Recovery (%)" value={selectedPad.rec} onChange={handleInputChange} step="0.1" icon={<FaPlus />} />
            <IconInput id="dens" label="Density (t/m³)" value={selectedPad.dens} onChange={handleInputChange} step="0.1" icon={<FaPlus />} />
        </div>
      </div>

      <div className="panel-block">
        <h3 className="panel-title"><FaTint /> Irrigation</h3>
        <IconInput id="irrRate" label="Emitter Rate (mL/min)" value={selectedPad.irrRate} onChange={handleInputChange} icon={<FaPlus />} />
        <div className="input-row">
            <IconInput id="lat" label="Lateral Spacing (cm)" value={selectedPad.lat} onChange={handleInputChange} icon={<FaPlus />} />
            <IconInput id="emit" label="Emitter Spacing (cm)" value={selectedPad.emit} onChange={handleInputChange} icon={<FaPlus />} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
