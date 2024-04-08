import React, { useState } from 'react';
import CurrentTournamentTable from './CurrentTournamentTable';
import Games from './Games/Games';
import cn from 'classnames';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import CurrentTournamentHeader from './CurrentTournamentHeader';

function CurrentTournamentMenu() {
  const id = Number(useLoaderData());
  console.log(id);

  const tournaments = JSON.parse(localStorage.getItem('tournaments'));
  let currentTournament = null;

  for (let tournament of tournaments) {
    if (tournament.id === id) {
      currentTournament = tournament;
      break;
    }
  }
  const tournamentData = [
    { id: 1, name: 'Мусин Тимур', goals: 12, matches: 3, wins: 4, draws: 0, losses: 0, goalsFor: 14, goalsAgainst: 5 },
    { id: 2, name: 'Мусина Диана', goals: 8, matches: 3, wins: 2, draws: 2, losses: 0, goalsFor: 10, goalsAgainst: 4 },
    { id: 3, name: 'Мусин Вячеслав', goals: 12, matches: 3, wins: 4, draws: 0, losses: 0, goalsFor: 11, goalsAgainst: 4 },
  ];

  const [selectedMenu, setSelectedMenu] = useState('home');

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div>
      <ul className="current-tournament__menu-list">
        <li
          className={cn('current-tournament__nav', { 'current-tournament__menu_active': selectedMenu === 'home' })}
          onClick={() => handleMenuClick('home')}>
          Главная
        </li>
        <li
          className={cn('current-tournament__nav', { 'current-tournament__menu_active': selectedMenu === 'table' })}
          onClick={() => handleMenuClick('table')}>
          Таблица
        </li>
        <li
          className={cn('current-tournament__nav', { 'current-tournament__menu_active': selectedMenu === 'games' })}
          onClick={() => handleMenuClick('games')}>
          Игры
        </li>
      </ul>

      {selectedMenu === 'home' && (
        <CurrentTournamentHeader
          title={currentTournament.title}
          endDate={currentTournament.endDate}
          description={currentTournament.tournamentDesc}
          sportType={currentTournament.sportType}
          startDate={currentTournament.startDate}
          typeTournament={currentTournament.typeTournament}
        />
      )}
      {selectedMenu === 'table' && <CurrentTournamentTable data={tournamentData} />}
      {selectedMenu === 'games' && <Games />}
    </div>
  );
}

export default CurrentTournamentMenu;
