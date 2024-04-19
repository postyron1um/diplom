import { forwardRef } from 'react';
import './DateInput.scss';

const DateInput = forwardRef(function DateInput({ className, id, children, value, onChange, minDate,appearance }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  //  const formatedDate = new Intl.DateTimeFormat('ru-RU').format(value);
  return (
    <div className="form-group">
      <label className="form-label">{children}</label>
      <input
        type="date"
        className={className}
        id={id}
        value={value} // Здесь подключаем значение
        onChange={handleChange} // Здесь подключаем обработчик изменения
      />
    </div>
  );
});

export default DateInput;
