import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {createBrowserRouter, redirect, RouterProvider} from 'react-router-dom';
import CreateTournament from "./components/CreateTournament/CreateTournament.jsx";
import AllTournaments from "./components/AllTournaments/AllTournaments.jsx";
import CurrentTournament from "./components/CurrentTournament/CurrentTournament.jsx";
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import Primary from './components/Primary/Primary.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/main',
        element: <Primary />,
      },
      // {
      //   index: true,
      //   element: <p>ПЕРЕЙДИТЕ КУДА НИТЬ</p>,
      // },
      {
        path: '/create',
        element: <CreateTournament />,
      },
      {
        path: '/alltournaments',
        element: <AllTournaments />,
      },
      {
        path: '/alltournaments/:tournamentID',
        element: <CurrentTournament />,
        async loader({ params }) {
          return params.tournamentID;
        },
      },
    ],
  },
  {
    path: '*',
    element: <p>нихуя нет</p>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
