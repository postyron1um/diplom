import React from 'react';
import './Modal.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button onClick={onClose}>
           <img className='close_modal' src="/close.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
