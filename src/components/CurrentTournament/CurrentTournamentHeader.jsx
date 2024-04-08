import React from 'react';

function CurrentTournamentHeader({ title, sportType, typeTournament, description, startDate, endDate }) {
  return (
    <>
      <h1 className="current-tournament__h1">Название: {title}</h1>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Вид спорта:</span>
        <span className="current-tournament__span">{sportType}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Тип турнира:</span>
        <span className="current-tournament__span">{typeTournament}</span>
      </h3>
      <h3 className="current-tournament__h3 current-tournament__h3-desc">
        <span className="current-tournament__span">Описание:</span>
        <span className="current-tournament__span sd">{description}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Дата начала:</span>
        <span className="current-tournament__span">{startDate}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Дата конца:</span>
        <span className="current-tournament__span">{endDate}</span>
      </h3>
    </>
  );
}

export default CurrentTournamentHeader;
