import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

const Header = ({ onExportPdf }) => {
  return (
    <header className="header">
      <h1>Heap Master Pro</h1>
      <button onClick={onExportPdf} className="header-button">
        <FaFilePdf size={24} />
      </button>
    </header>
  );
};

export default Header;
