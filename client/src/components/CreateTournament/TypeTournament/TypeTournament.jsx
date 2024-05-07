function TypeTournament({ label, options, defaultValue, onChange }) {
  const handleRadioChange = (e) => {
    const value = e.target.value;
    onChange(value); // Вызовите функцию обработчика изменения типа турнира из родительского компонента
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {options.map((option, index) => (
        <div key={index} className="form-check form-check__typeTournament">
          <input
            id={option}
            name="typeTournament"
            type="radio"
            value={option}
            checked={option === defaultValue}
            onChange={handleRadioChange}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
}

export default TypeTournament;
