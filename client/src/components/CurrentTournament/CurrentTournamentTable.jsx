import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';

function CurrentTournamentTable() {
  const [tableData, setTableData] = useState([]);
  const [isTournamentStarted, setIsTournamentStarted] = useState(false);
  const tournamentId = location.pathname.split('/')[2];
  // console.log(tournamentId);
  useEffect(() => {
    // Функция для загрузки данных об игроках турнира из базы данных
    const fetchPlayerData = async () => {
      try {
        // Здесь нужно заменить 'tournamentId' на актуальный ID турнира
        const response = await axios.get(`/tournaments/${tournamentId}/players`);
				console.log(response.data.players);
        if (response.data.success) {
          setTableData(response.data.players);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных об игроках турнира:', error);
      }
    };

    // Функция для проверки, начался ли турнир
    const checkTournamentStatus = async () => {
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/status`);
        if (response.data.success) {
          setIsTournamentStarted(response.data.isStarted);
        }
      } catch (error) {
        console.error('Ошибка при проверке статуса турнира:', error);
      }
    };

    fetchPlayerData(); 
    checkTournamentStatus(); 	
  }, []);

  return (
    <div className="currentTournamentTable">
      {isTournamentStarted ? (
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>О</th>
              <th>И</th>
              <th>В</th>
              <th>Н</th>
              <th>П</th>
              <th>З-П</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((player, id) => (
              <tr key={id}>
                <td>{player.username}</td>
                <td>{player.wins * 3 + player.draws}</td>
                <td>{player.matches}</td>
                <td>{player.wins}</td>
                <td>{player.draws}</td>
                <td>{player.losses}</td>
                <td>
                  {player.goalsFor}-{player.goalsAgainst} ({player.goalsFor - player.goalsAgainst})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-players">Турнир еще не начался. Загляните чуть позже 😊</div>
      )}
    </div>
  );
}

export default CurrentTournamentTable;
