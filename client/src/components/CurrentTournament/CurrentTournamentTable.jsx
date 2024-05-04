import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';

function CurrentTournamentTable() {
  const [tableData, setTableData] = useState([]);
  const tournamentId = location.pathname.split('/')[2];
  console.log(tournamentId);
  useEffect(() => {
    // Функция для загрузки данных об игроках турнира из базы данных
    const fetchPlayerData = async () => {
      try {
        // Здесь нужно заменить 'tournamentId' на актуальный ID турнира
        const response = await axios.get(`/tournaments/${tournamentId}/players`);
        if (response.data.success) {
          setTableData(response.data.players);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных об игроках турнира:', error);
      }
    };

    fetchPlayerData(); // Вызов функции загрузки данных об игроках турнира
  }, []);

  tableData.map((player) => {
    console.log(player.team1);
  });
  console.log(tableData);

  return (
    <div className="currentTournamentTable">
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
    </div>
  );
}

export default CurrentTournamentTable;
