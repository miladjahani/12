import React from 'react';
import { FaCubes, FaMoon, FaSun, FaFilePdf } from 'react-icons/fa';
import { exportToPDF } from '../utils/pdfExport';

const Header = ({ theme, toggleTheme, pad, stats }) => (
    <header>
        <div className="logo">
            <FaCubes />
            <h1>Heap Master Pro</h1>
        </div>
        <div className="header-actions">
            <button className="theme-toggle" onClick={() => exportToPDF(pad, stats)}>
                <FaFilePdf />
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
        </div>
    </header>
);

export default Header;
