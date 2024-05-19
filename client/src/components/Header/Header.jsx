// import React from 'react';
import './Header.scss';

import Logo from './Logo/Logo';
import MenuIcon from './MenuIcon/MenuIcon';
import Signup from './Signup/Signup';
import Navigation from './Navigation/Navigation';


function Header() {
//  const userToken = localStorage.getItem('token');
//  const extractUserRoleFromToken = (token) => {
//    try {
//      // декодируем токен, разделяя его по точке и декодируя вторую часть, содержащую полезные данные
//      const payload = JSON.parse(atob(token.split('.')[1]));
//      return payload.username;
//    } catch (error) {
//      console.error('Ошибка при извлечении ID пользователя из токена:', error);
//      return null;
//    }
//  };

//  const username = extractUserRoleFromToken(userToken);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Logo />
          <Navigation />
          <Signup />
          <MenuIcon />
          
        </nav>
      </div>
    </header>
  );
}
export default Header;
