import React, { useEffect } from 'react';
import './MenuIcon.scss';
function MenuIcon() {
  useEffect(() => {
    const menuIcon = document.querySelector('.menu-icon');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    const signUp = document.querySelector('.signup');

    const handleClick = () => {
      nav.classList.toggle('active');
      navList.classList.toggle('active');
      signUp.classList.toggle('active');
    };

    menuIcon.addEventListener('click', handleClick);

    return () => {
      menuIcon.removeEventListener('click', handleClick);
    };
  }, []); // Пустой массив зависимостей указывает, что эффект будет запускаться только при монтировании компонента

  return (
    <div className="fl-direction2">
      <div className="menu-icon">
        <i className="fa fa-bars"></i>
      </div>
    </div>
  );
}

export default MenuIcon;
