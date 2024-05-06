import React from 'react';
import './Modal.css';
import { FaBeer } from 'react-icons/fa';
const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button onClick={onClose}>
           Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
