// import React from 'react';
import './TournamentItem.scss';
import TournamentLink from '../TournamentLink/TournamentLink';

function TournamentItem({ tournament }) {
  const { sportType, typeTournament, title, startDate, endDate } = tournament;
  // const formattedStartDate = startDate.toLocaleDateString();
  // const formattedEndDate = endDate.toLocaleDateString();
  return (
    <>
      <div className="tournament__box-row">
        <div className="tournament__box-grid">
          <span className="tournament__sport-type">{sportType}</span>
          <span>{typeTournament}</span>
          {/* <div className="span-group"> */}
          <span>Дата начала: {startDate.toLocaleString()} </span>
          <span>Дата конца: {endDate.toLocaleString()}</span>
          {/* </div> */}
        </div>
        <h3>{title}</h3>
      </div>

      {/* <TournamentLink /> */}
    </>
  );
}

export default TournamentItem;
