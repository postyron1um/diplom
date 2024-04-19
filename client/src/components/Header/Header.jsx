// import React from 'react';
import './Header.scss';

import Logo from './Logo/Logo';
import MenuIcon from './MenuIcon/MenuIcon';
import Signup from './Signup/Signup';
import Navigation from './Navigation/Navigation';


function Header() {
 
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
