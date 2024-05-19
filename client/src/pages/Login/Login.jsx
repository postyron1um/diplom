import React, { useEffect, useState } from 'react';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIsAuth, loginUser } from '../../redux/features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import useFormReducer from '../Register/Register.state';
function Login() {
  const { state, setFieldValue, setFieldError } = useFormReducer();
  const { email, password, errors } = state;
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

  const validateInputs = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setFieldError('email', 'Введите корректный email');
      isValid = false;
    } else {
      setFieldError('email', '');
    }
    if (password.length < 6) {
      setFieldError('password', 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    } else {
      setFieldError('password', '');
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
		console.log(validateInputs);
    if (validateInputs()) {
      try {
        dispatch(loginUser({ email, password }));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="container">
      <div className={styles['login']}>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <p className={styles['title']}>Авторизация </p>

          <label>
            <input
              value={email}
              onChange={(e) => setFieldValue('email', e.target.value)}
              className={styles['input']}
              type="email"
              placeholder=""
              required=""
            />
            <span>Email</span>
            {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
          </label>
          <label>
            <input
              value={password}
              onChange={(e) => setFieldValue('password', e.target.value)}
              className={styles['input']}
              type="password"
              placeholder=""
              required=""
            />
            <span>Пароль</span>
            {errors.password && <span className={styles['error-message']}>{errors.password}</span>}
          </label>
          <button type="submit" className={styles['submit']}>
            Зарегистрироваться
          </button>
          <p className={styles['signin']}>
            У вас нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
