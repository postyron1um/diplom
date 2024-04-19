import './Button.scss';
function Button({ type, onClick, children }) {
  return (
    <div className="form-group">
      <button onClick={onClick} type={type} className="createTournament__btn">
        {children}
      </button>
    </div>
  );
}

export default Button;
