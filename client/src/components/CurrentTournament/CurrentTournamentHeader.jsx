import React from 'react';
import {useRouteLoaderData} from "react-router-dom";

function CurrentTournamentHeader() {
    const tournament = useRouteLoaderData('all_tournaments');
console.log(tournament);
  return (
    <>
      <h1 className="current-tournament__h1">Название: {tournament.title}</h1>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Вид спорта:</span>
        <span className="current-tournament__span">{tournament.sportType}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Тип турнира:</span>
        <span className="current-tournament__span">{tournament.typeTournament}</span>
      </h3>
      <h3 className="current-tournament__h3 current-tournament__h3-desc">
        <span className="current-tournament__span">Описание:</span>
        <span className="current-tournament__span sd">{tournament.tournamentDesc}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Дата начала:</span>
        <span className="current-tournament__span">{tournament.startDate}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span">Дата конца:</span>
        <span className="current-tournament__span">{tournament.endDate}</span>
      </h3>
    </>
  );
}

export default CurrentTournamentHeader;
