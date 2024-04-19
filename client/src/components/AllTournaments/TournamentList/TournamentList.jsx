import React, { useEffect, useState } from 'react';
import CardButton from '../../CardButton/CardButton';
import TournamentItem from '../TournamentItem/TournamentItem';
import './TournamentList.scss';
import { Link } from 'react-router-dom';

function TournamentList({ searchInput, sportType, tournamentType, currentPage, tournamentsPerPage }) {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const sortedTournaments = storedTournaments
      .map((tournament) => ({ ...tournament, createdAt: new Date(tournament.createdAt) }))
      .sort((a, b) => b.createdAt - a.createdAt);
    setTournaments(sortedTournaments);
  }, []);

  const tournamentsWithDate = tournaments?.map((tournament) => ({
    ...tournament,
    createdAt: new Date(tournament.createdAt),
  }));

  const filteredTournaments = tournamentsWithDate.filter(
    (tournament) =>
      tournament.title.toLowerCase().includes(searchInput.toLowerCase()) &&
      (sportType ? tournament.sportType === sportType : true) &&
      (tournamentType ? tournament.typeTournament === tournamentType : true),
  );

  if (filteredTournaments.length === 0) {
    return <h3 className="no-tournaments">Пока турниров нет, вы можете добавить первый.</h3>;
  }

  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = filteredTournaments.slice(indexOfFirstTournament, indexOfLastTournament);

  return (
    <div className="tournament__container">
      {currentTournaments.map((tournament) => (
        <Link key={tournament.id} to={`${tournament.id}/main`}>
          <CardButton className="tournament-item">
            <TournamentItem tournament={tournament} />
          </CardButton>
        </Link>
      ))}
    </div>
  );
}

export default TournamentList;
