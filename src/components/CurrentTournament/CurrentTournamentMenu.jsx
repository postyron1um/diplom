import React, { useState } from 'react';
import CurrentTournamentTable from './CurrentTournamentTable';
import Games from './Games/Games';
import AdminPanel from './AdminPanel/AdminPanel';
import { useLoaderData } from 'react-router-dom';
import CurrentTournamentHeader from './CurrentTournamentHeader';

function CurrentTournamentMenu() {
  const id = Number(useLoaderData());
  const tournaments = JSON.parse(localStorage.getItem('tournaments'));
  let currentTournament = null;

  for (let tournament of tournaments) {
    if (tournament.id === id) {
      currentTournament = tournament;
      break;
    }
  }

  const [participantName, setParticipantName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [registrations, setRegistrations] = useState(JSON.parse(localStorage.getItem('tournamentParticipants')) || []);
  const [tournamentParticipants, setTournamentParticipants] = useState(
    JSON.parse(localStorage.getItem('tournamentAcceptedParticipants')) || [],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const participant = {
      id: Date.now(),
      name: participantName,
    };
    setRegistrations(prevRegistrations => [...prevRegistrations, participant]);
    localStorage.setItem('tournamentParticipants', JSON.stringify([...registrations, participant]));
    setParticipantName('');
  };

  const handleCreateTeam = (e) => {
    const tournamentTeams = JSON.parse(localStorage.getItem('tournamentTeams')) || [];
    e.preventDefault();
    const team = {
      id: Date.now(),
      name: teamName,
    };
    localStorage.setItem('tournamentTeams', JSON.stringify([...tournamentTeams, team]));
    setTeamName('');
  };

  const [selectedMenu, setSelectedMenu] = useState('home');

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div>
      <ul className="current-tournament__menu-list">
        <li
          className={`current-tournament__nav ${selectedMenu === 'home' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('home')}>
          Главная
        </li>
        <li
          className={`current-tournament__nav ${selectedMenu === 'table' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('table')}>
          Таблица
        </li>
        <li
          className={`current-tournament__nav ${selectedMenu === 'games' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('games')}>
          Игры
        </li>
        <li
          className={`current-tournament__nav ${selectedMenu === 'register' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('register')}>
          Зарегистрироваться на турнир
        </li>
        <li
          className={`current-tournament__nav ${selectedMenu === 'admin' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('admin')}>
          Административная панель
        </li>
      </ul>

      {selectedMenu === 'home' && (
        <div>
          <CurrentTournamentHeader
            title={currentTournament.title}
            endDate={currentTournament.endDate}
            description={currentTournament.tournamentDesc}
            sportType={currentTournament.sportType}
            startDate={currentTournament.startDate}
            typeTournament={currentTournament.typeTournament}
          />
        </div>
      )}
      {selectedMenu === 'register' && (
        <div className="tournament-register">
          <div className="participant">
            <form onSubmit={handleSubmit}>
              <div className="participant-row">
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
                <button type="submit">Зарегистрироваться как участник</button>
              </div>
            </form>
          </div>
          <div className="register_or"> ИЛИ </div>
          <div className="teamName">
            <form onSubmit={handleCreateTeam}>
              <div className="teamName-row">
                <input
                  type="text"
                  placeholder="Введите название вашей команды"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <button type="submit">Создать команду</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedMenu === 'table' && <CurrentTournamentTable data={tournamentParticipants} />}
      {selectedMenu === 'games' && <Games  />}
      {selectedMenu === 'admin' && (
        <AdminPanel
          registrations={registrations}
          setRegistrations={setRegistrations}
          setTournamentParticipants={setTournamentParticipants}
        />
      )}
    </div>
  );
}

export default CurrentTournamentMenu;
