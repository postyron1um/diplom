import './App.css';
import Header from './components/Header/Header';
import CreateTournament from './components/CreateTournament/CreateTournament';
import AllTournaments from './components/AllTournaments/AllTournaments';
import { useEffect, useState } from 'react';
import {Outlet} from "react-router-dom";
import Primary from './components/Primary/Primary';
// import CurrentTournament from './components/CurrentTournament/CurrentTournament';


function App() {
  //const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('data'));
    if (data) {
      // setTournaments(
      //   data.map((tournament) => ({
      //     ...tournament,
      //     startDate: new Date(tournament.startDate).toISOString().split('T')[0], // Только дата без времени
      //     endDate: new Date(tournament.endDate).toISOString().split('T')[0], // Только дата без времени
      //   })),
      // );
    }
  }, []);

  // useEffect(() => {
  //   if (tournaments.length) {
  //     localStorage.setItem('data', JSON.stringify(tournaments));
  //   }
  // }, [tournaments]);

  return (
    <>
      <Header />
      {/*<div className="CreateTournament__AllTournaments container">*/}
      {/*  <AllTournaments />*/}
      {/*  <CreateTournament onAddTournament={handleAddTournament} />*/}
      {/*</div>*/}
      {/*<AllTournaments />*/}
        <Outlet />

      {/* <CurrentTournament/> */}
    </>
  );
}

export default App;
