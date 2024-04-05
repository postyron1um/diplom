import React, { useState } from 'react';
import TournamentList from './TournamentList/TournamentList';
import './AllTournaments.scss';
// import TournamentList from './TournamentList';

function AllTournaments({ tournaments }) {
  return (
    <div className="tournament">
      <div className="container">
        <h1>Все турниры и чемпионаты</h1>
        <TournamentList tournaments={tournaments} />
      </div>
    </div>
  );
}

export default AllTournaments;
