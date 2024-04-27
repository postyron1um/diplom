import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, redirect, RouterProvider, useLoaderData } from 'react-router-dom';
import CreateTournament from './components/CreateTournament/CreateTournament.jsx';
import AllTournaments from './components/AllTournaments/AllTournaments.jsx';
import CurrentTournament from './components/CurrentTournament/CurrentTournament.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import Primary from './components/Primary/Primary.jsx';
import AdminPanel from './components/CurrentTournament/AdminPanel/AdminPanel.jsx';
import RegistrationInTournament from './components/CurrentTournament/RegistrationInTournament.jsx';
import CurrentTournamentTable from './components/CurrentTournament/CurrentTournamentTable.jsx';
import KnockoutTournament from './components/CurrentTournament/KnockoutTournament/KnockoutTournament.jsx';
import Games from './components/CurrentTournament/Games/Games.jsx';
import CurrentTournamentHeader from './components/CurrentTournament/CurrentTournamentHeader.jsx';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import axios from './utils/axios.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <NotFoundPage />,
    children: [
      {
        path: '/main',
        element: <Primary />,
      },
      {
        path: '/create',
        element: <CreateTournament />,
      },
      {
        path: '/registration',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/alltournaments',
        element: <AllTournaments />,
      },
      {
        path: '/alltournaments/:tournamentID',
        element: <CurrentTournament />,
        id: 'all_tournaments',
        async loader({ params }) {
          const id = params.tournamentID;
          const tournaments = (await axios.get('/tournaments')).data.tournaments;
          let currentTournament = null;

          for (let tournament of tournaments) {
            if (tournament._id === id) {
              currentTournament = tournament;
              break;
            }
          }
          return currentTournament;
        },
        children: [
          {
            path: '/alltournaments/:tournamentID/admin',
            element: <AdminPanel />,
          },
          {
            path: '/alltournaments/:tournamentID/table',
            element: <CurrentTournamentTable />,
          },
          {
            path: '/alltournaments/:tournamentID/reg',
            element: <RegistrationInTournament />,
            id: ':tournamentID/reg',
            async loader({ params }) {
              const id = params.tournamentID;
              const tournaments = (await axios.get('/tournaments')).data.tournaments;
              let currentTournament = null;

              for (let tournament of tournaments) {
                if (tournament._id === id) {
                  currentTournament = tournament;
                  break;
                }
              }
              return currentTournament;
            },
          },
          {
            path: '/alltournaments/:tournamentID/matches',
            element: <KnockoutTournament />,
          },
          {
            path: '/alltournaments/:tournamentID/games',
            element: <Games />,
          },
          {
            path: '/alltournaments/:tournamentID/main',
            element: <CurrentTournamentHeader />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <p>WTF</p>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
