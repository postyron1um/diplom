import './TournamentItem.scss';

function TournamentItem({ tournament }) {
  const { sportType, typeTournament, title, startDate, endDate } = tournament;

  // Функция для преобразования даты в строку формата "год-месяц-день"
  const formatDate = (date) => {
    const eventDate = new Date(date);
    const year = eventDate.getFullYear();
    const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
    const day = eventDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div className="tournament__box-row">
        <div className="tournament__box-grid">
          <span className="tournament__sport-type">{sportType}</span>
          <span>{typeTournament}</span>
          <span>Дата начала: {formatDate(startDate)} </span>
          <span>Дата конца: {formatDate(endDate)}</span>
        </div>
        <h3>{title}</h3>
      </div>
    </>
  );
}

export default TournamentItem;
