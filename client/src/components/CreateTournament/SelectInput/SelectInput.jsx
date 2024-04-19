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
      {/* <input list="sports" // Используем defaultValue вместо value
               name={name}/> */}
      <select value={value} name={name} className={className} id="sports" onChange={handleChange}>
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
