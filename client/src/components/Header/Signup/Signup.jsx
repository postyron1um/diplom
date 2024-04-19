import { NavLink } from 'react-router-dom';
import './Signup.scss';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, logout } from '../../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
function Signup() {

  const isAuth = useSelector(checkIsAuth);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    toast('Вы вышли из системы');
  };
  return (
    <>
      {!isAuth ? (
        <div className="signup">
          <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/registration">
            Регистрация
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/login">
            Вход
          </NavLink>
        </div>
      ) : (
        <button onClick={logoutHandler}>Выйти с аккаунта</button>
      )}
    </>
  );
}

export default Signup;
