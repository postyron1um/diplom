import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {createBrowserRouter, redirect, RouterProvider, useLoaderData} from 'react-router-dom';
import CreateTournament from "./components/CreateTournament/CreateTournament.jsx";
import AllTournaments from "./components/AllTournaments/AllTournaments.jsx";
import CurrentTournament from "./components/CurrentTournament/CurrentTournament.jsx";
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import Primary from './components/Primary/Primary.jsx';
import AdminPanel from "./components/CurrentTournament/AdminPanel/AdminPanel.jsx";
import Registration from "./components/CurrentTournament/Registration.jsx";
import CurrentTournamentTable from "./components/CurrentTournament/CurrentTournamentTable.jsx";
import KnockoutTournament from "./components/CurrentTournament/KnockoutTournament/KnockoutTournament.jsx";
import Games from "./components/CurrentTournament/Games/Games.jsx";
import CurrentTournamentHeader from "./components/CurrentTournament/CurrentTournamentHeader.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <NotFoundPage/>,
        children: [
            {
                path: '/main',
                element: <Primary/>,
            },
            // {
            //   index: true,
            //   element: <p>ПЕРЕЙДИТЕ КУДА НИТЬ</p>,
            // },
            {
                path: '/create',
                element: <CreateTournament/>,
            },
            {
                path: '/alltournaments',
                element: <AllTournaments/>,
            },
            {
                path: '/alltournaments/:tournamentID',
                element: <CurrentTournament/>,
                id: 'all_tournaments',
                async loader({params}) {
                    const id = Number(params.tournamentID);
                    const tournaments = JSON.parse(localStorage.getItem('tournaments'));
                    let currentTournament = null;

                    for (let tournament of tournaments) {
                        if (tournament.id === id) {
                            currentTournament = tournament;
                            break;
                        }
                    }
                    return currentTournament;
                },
                children: [
                    {
                        path: '/alltournaments/:tournamentID/admin',
                        element: <AdminPanel/>
                    },
                    {
                        path: '/alltournaments/:tournamentID/table',
                        element: <CurrentTournamentTable/>
                    },
                    {
                        path: '/alltournaments/:tournamentID/reg',
                        element: <Registration/>
                    },
                    {
                        path: '/alltournaments/:tournamentID/matches',
                        element: <KnockoutTournament/>
                    },
                    {
                        path: '/alltournaments/:tournamentID/games',
                        element: <Games/>
                    },
                    {
                        index: true,
                        element: <CurrentTournamentHeader/>,
                    }
                ]
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
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
