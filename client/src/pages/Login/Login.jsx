import React, { useEffect, useState } from 'react';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIsAuth, loginUser } from '../../redux/features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);

  useEffect(() => {
    if (status) {
      toast(status);
    }
    if (isAuth) navigate('/main');
  }, [status, isAuth, navigate]);
  const handleSubmit = () => {
    console.log(username, password);
    try {
      dispatch(loginUser({ username, password }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <div className={styles['login']}>
        <form onSubmit={(e) => e.preventDefault()} className={styles['login-form']}>
          <span className={styles['login-title']}>Авторизация</span>
          <div className={styles['wrap-input']}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles['login-input']}
              type="text"
              name=""
              id=""
            />
          </div>
          <div className={styles['wrap-input']}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles['login-input']}
              type="password"
              name=""
              id=""
            />
          </div>
          <div className={styles['not-account-need-register']}>
            <button onClick={handleSubmit} className={styles['login-btn']}>
              Войти
            </button>
            <div className={styles['no-account-align']}>
              <Link to="/registration">
                <span className={styles['no-account']}>Нет аккаунта?</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
