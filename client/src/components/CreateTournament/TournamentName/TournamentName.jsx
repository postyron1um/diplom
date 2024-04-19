import { forwardRef, useState } from 'react';
import './TournamentName.scss';

function TournamentName({ label, value, maxLength, onChange, name, className }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type="text"
        name={name}
        className={className}
        maxLength={maxLength}
        value={value} // Привязываем значение ввода к состоянию
        onChange={handleChange}
      />
    </div>
  );
}

export default TournamentName;
