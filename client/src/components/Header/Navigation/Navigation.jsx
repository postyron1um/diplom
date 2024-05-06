// import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navigation.scss';
import cn from 'classnames';
import extractUserRoleFromToken from '../../../Func/extractUserDetailsFromToken';

function Navigation() {
  const userToken = localStorage.getItem('token');
  const role = extractUserRoleFromToken(userToken,'roles');
  const isAdmin = role.includes('ADMIN');

  return (
    <div>
      <div className="fl-direction">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              // className={cnNav + (({ isActive, isPending }) => (isActive ? 'nav_active' : isPending ? 'pending' : ''))}
              className={({ isActive }) => (isActive ? 'nav_active' : 'pending')}
              // className="nav-item__link"
              to="/main">
              Главная
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) => (isActive ? 'nav_active' : 'pending')}
              // className={({ isActive, isPending }) => (isActive ? 'nav_active' : isPending ? 'pending' : '')}
              to="./alltournaments">
              Турниры и чемпионаты
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <a className="nav-item__link" href="#!">
              Новости
            </a>
          </li> */}
          {isAdmin ? (
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav_active' : 'pending')}
                // className={({ isActive, isPending }) => (isActive ? 'nav_active' : isPending ? 'pending' : '')}
                to="/create">
                Создать турнир
              </NavLink>
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
