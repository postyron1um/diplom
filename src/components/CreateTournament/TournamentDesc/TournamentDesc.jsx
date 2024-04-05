// import React from 'react';
import './TournamentDesc.scss';

function TournamentDesc({ label, maxLength, value, onChange, className }) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea
        maxLength={maxLength}
        className={className}
        value={value} // Устанавливаем значение из props
        onChange={handleChange} // Обработчик изменений
      ></textarea>
    </div>
  );
}

export default TournamentDesc;
