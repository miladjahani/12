import React from 'react';
import { FaCube } from 'react-icons/fa';

const Footer = ({ onOpen3D }) => (
    <footer className="fab-container">
        <button className="fab-3d" onClick={onOpen3D}>
            <FaCube /> نمای سه‌بعدی
        </button>
    </footer>
);

export default Footer;
