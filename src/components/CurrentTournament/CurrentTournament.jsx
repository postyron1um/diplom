import React from 'react';
import CurrentTournamentHeader from './CurrentTournamentHeader';
import CurrentTournamentMenu from './CurrentTournamentMenu';
import CurrentTournamentTable from './CurrentTournamentTable';
import './CurrentTournament.scss';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import Games from './Games/Games';
function CurrentTournament() {
 

  return (
    <div className="container">
      <div className="current-tournament">
        
        <CurrentTournamentMenu />

        {/* <Games/> */}
      </div>
    </div>
  );
}

export default CurrentTournament;
