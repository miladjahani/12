import React from 'react';

const KPICard = ({ title, value, unit, icon, color }) => (
    <div className="kpi-card">
        <div className="kpi-head">
            {icon} {title}
        </div>
        <div className="kpi-val" style={{ color }}>
            <span>{value}</span>
            <span className="kpi-unit">{unit}</span>
        </div>
    </div>
);

export default KPICard;
