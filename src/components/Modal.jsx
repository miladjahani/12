import React from 'react';
import './Modal.css';

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          {onCancel && <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>}
          <button className="btn-primary" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
