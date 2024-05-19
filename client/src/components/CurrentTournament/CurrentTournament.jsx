import { useEffect } from 'react';
import CurrentTournamentMenu from './CurrentTournamentMenu';

import './CurrentTournament.scss';
import { Outlet, useParams, } from 'react-router-dom';

function CurrentTournament() {
  const { tournamentID } = useParams();
  // console.log(tournamentID);
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`http://localhost:3007/api/tournaments/${tournamentID}`);
        if (!response.ok) {
          throw new Error('Ошибка при получении данных о турнирах');
        }
        // const data = await response.json();
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    };

    fetchTournaments();
  }, []);
  return (
    <div className="container">
      <div className="current-tournament">
        <CurrentTournamentMenu />
        <Outlet />
        {/* <Games/> */}
      </div>
    </div>
  );
}

export default CurrentTournament;
