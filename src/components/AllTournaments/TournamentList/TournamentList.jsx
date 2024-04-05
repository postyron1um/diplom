import React from 'react';
import CardButton from '../../CardButton/CardButton';
import TournamentItem from '../TournamentItem/TournamentItem';
import './TournamentList.scss';

function TournamentList({ tournaments }) {
  // Добавление даты создания к турнирам
  const tournamentsWithDate = tournaments.map((tournament) => ({
    ...tournament,
    createdAt: new Date(tournament.createdAt), // Преобразуем строку обратно в объект Date
  }));

  if (tournaments.length === 0) {
    return <h3 className='no-tournaments'>Пока турниров нет, вы можете добавить первый.</h3>;
  }
  // Сортировка турниров по дате создания (от самого нового к самому старому)
  const sortedTournaments = [...tournamentsWithDate].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="tournament__container">
      {sortedTournaments.map((tournament) => (
        <CardButton key={tournament.id} className="tournament-item">
          <TournamentItem tournament={tournament} />
        </CardButton>
      ))}
    </div>
  );
}

export default TournamentList;
