import { useDispatch } from 'react-redux';
import './App.css';
import Header from './components/Header/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { getMe } from './redux/features/auth/authSlice';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  });
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer position="bottom-center" theme="dark" />
    </>
  );
}

export default App;
