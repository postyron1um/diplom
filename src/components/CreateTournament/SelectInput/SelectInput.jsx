import React, { forwardRef } from 'react';
import './SelectInput.scss';

function SelectInput({ label, options, value, onChange, name, className }) {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue); // Передаем значение обратно в родительский компонент
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select
        className={className}
        defaultValue={value} // Используем defaultValue вместо value
        name={name}
        onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
