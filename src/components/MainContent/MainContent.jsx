import React from 'react';
import { FaCube, FaGem, FaFlask, FaWater, FaChartArea, FaWeightHanging } from 'react-icons/fa';

const StatCard = ({ title, value, unit, icon }) => (
    <div className="stat-card">
        <h4>{icon} {title}</h4>
        <p>
            {value} <span className="unit">{unit}</span>
        </p>
    </div>
);

const MainContent = ({ selectedPad, stats }) => {
    if (!selectedPad || !stats) {
        return <main className="main-content"><h2>Select a pad to see its report.</h2></main>;
    }

    return (
        <main className="main-content">
            <h2>Report: {selectedPad.name}</h2>
            <div className="stats-grid">
                <StatCard title="Recoverable Copper" value={stats.cu.toFixed(2)} unit="tons" icon={<FaGem />} />
                <StatCard title="Total Fill Volume" value={Math.round(stats.vol).toLocaleString()} unit="m³" icon={<FaCube />} />
                <StatCard title="Total Ore Mass" value={Math.round(stats.mass).toLocaleString()} unit="tons" icon={<FaWeightHanging />} />
                <StatCard title="Required Acid" value={Math.round(stats.acid).toLocaleString()} unit="tons" icon={<FaFlask />} />
                <StatCard title="Top Surface Area" value={Math.round(stats.topArea).toLocaleString()} unit="m²" icon={<FaChartArea />} />
                <StatCard title="Irrigation Flow Rate" value={stats.flow_m3_hr.toFixed(2)} unit="m³/hr" icon={<FaWater />} />
            </div>
        </main>
    );
};

export default MainContent;
