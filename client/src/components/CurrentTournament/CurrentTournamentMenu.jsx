import { useSelector } from 'react-redux';
import { NavLink, useLoaderData } from 'react-router-dom';
import { checkIsAuth } from '../../redux/features/auth/authSlice';
import { useEffect } from 'react';
import extractUserRoleFromToken  from '../../Func/extractUserDetailsFromToken';

function CurrentTournamentMenu() {
  let currentTournament = useLoaderData();
  useEffect(() => {
    const menuIcon2 = document.querySelector('.menu-icon2');
    const menuList = document.querySelector('.current-tournament__menu-list');
    const handleClick = () => {
      menuList.classList.toggle('active');
    };
    menuIcon2.addEventListener('click', handleClick);
    return () => {
      menuIcon2.removeEventListener('click', handleClick);
    };
  }, []);

  const userToken = localStorage.getItem('token');
  const role = extractUserRoleFromToken(userToken,'roles');
  const isAdmin = role.includes('ADMIN');

  return (
    <div className="relative-icon">
      <div className="menu-icon2">
        <i className="fa fa-bars"></i>
      </div>
      <ul className="current-tournament__menu-list">
        <div className="fl-direction2"></div>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="main">
            Главная
          </NavLink>
        </li>
        {isAdmin ? (
          <li>
            <NavLink className={({ isActive }) => (isActive ? 'menu_activ' : 'pending')} to="admin">
              Административаня панель
            </NavLink>
          </li>
        ) : (
          ''
        )}
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
      </ul>
    </div>
  );
}

export default CurrentTournamentMenu;
