import { useSelector } from 'react-redux';
import { NavLink, useLoaderData } from 'react-router-dom';
import { checkIsAuth } from '../../redux/features/auth/authSlice';

function CurrentTournamentMenu() {
  let currentTournament = useLoaderData();
  // console.log(currentTournament);

  return (
    <div>
      <ul className="current-tournament__menu-list">
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="main">
            Главная
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="admin">
            Административаня панель
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="reg">
            Регистрация
          </NavLink>
        </li>
        {currentTournament.typeTournament === 'На вылет' && (
          <li>
            <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="matches">
              Матчи
            </NavLink>
          </li>
        )}
        {currentTournament.typeTournament === 'Круговой' && (
          <>
            <li>
              <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="table">
                Таблица
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="games">
                Игры
              </NavLink>
            </li>
          </>
        )}

        {/*<li
          className={`current-tournament__nav ${selectedMenu === 'admin' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('admin')}>
          Административная панель
        </li>
        {currentTournament.typeTournament === 'Круговой' && (
          <>
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
          </>
        )}
        {currentTournament.typeTournament === 'На вылет' && (
          <li
            className={`current-tournament__nav ${
              selectedMenu === 'KnockoutTournament' ? 'current-tournament__menu_active' : ''
            }`}
            onClick={() => handleMenuClick('KnockoutTournament')}>
            Матчи
          </li>
        )}
        <li
          className={`current-tournament__nav ${selectedMenu === 'register' ? 'current-tournament__menu_active' : ''}`}
          onClick={() => handleMenuClick('register')}>
          Зарегистрироваться на турнир
        </li>*/}
      </ul>

      {/*{selectedMenu === 'home' && (
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

      {currentTournament.typeTournament === 'Круговой' && (
        <>
          {selectedMenu === 'games' && <Games onUpdateTableData={updateTournamentTableData} />}
          {selectedMenu === 'table' && <CurrentTournamentTable data={tournamentParticipants} />}
        </>
      )}
      {selectedMenu === 'admin' && (
        <AdminPanel
          registrations={registrations}
          setRegistrations={setRegistrations}
          setTournamentParticipants={setTournamentParticipants}
        />
      )}
      {currentTournament.typeTournament === 'На вылет' && selectedMenu === 'KnockoutTournament' && <KnockoutTournament />}*/}
    </div>
  );
}

export default CurrentTournamentMenu;
