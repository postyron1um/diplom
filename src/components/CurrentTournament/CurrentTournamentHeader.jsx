import React from 'react';

function CurrentTournamentHeader({ title, sportType, typeTournament, description, startDate, endDate }) {
  return (
    <>
      <h1>{title}</h1>
      <h3 className="current-tournament__sportType">
        <span className="current-tournament__span">Вид спорта:</span>
        <span className="ds">{sportType}</span>
      </h3>
      <h3 className="current-tournament__typeTournament">
        <span className="current-tournament__span">Тип турнира:</span>
        <span className="ds">{typeTournament}</span>
      </h3>
      <h3 className="current-tournament__desc">
        <span>Описание:</span>
        <span className="ds sd">{description}</span>
      </h3>
      <h3 className="current-tournament__startDate">
        <span className="current-tournament__span">Дата начала:</span>
        <span className="ds">{startDate}</span>
      </h3>
      <h3 className="current-tournament__startEnd">
        <span className="current-tournament__span">Дата конца:</span>
        <span className="ds">{endDate}</span>
      </h3>
    </>
  );
}

export default CurrentTournamentHeader;
