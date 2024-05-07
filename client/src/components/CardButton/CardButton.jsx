import React from 'react';
import './CardButton.css';
function CardButton({ children, className }) {
  const cl = 'card-button' + (className ? ' ' + className : '');
  return <div className={cl}>{children}</div>;
}

export default CardButton;
