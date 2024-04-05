// import React from 'react';
import './Navigation.scss';

function Navigation() {
  return (
    <div>
      <div className="fl-direction">
        <ul className="nav-list">
          <li className="nav-item">
            <a className="nav-item__link" href="#!">
              Главная
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-item__link" href="./allTournaments.html">
              Турниры и чемпионаты
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-item__link" href="#!">
              Новости
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
