import React, { useState, useEffect } from 'react';
import TournamentList from './TournamentList/TournamentList';
import cn from 'classnames';
import './AllTournaments.scss';
import { sportTypeOptions, typeTournamentMap } from '../CreateTournament/CreateTournament.state';

function AllTournaments() {
  const [searchInput, setSearchInput] = useState('');
  const [sportType, setSportType] = useState('');
	const [typeTournament, setTournamentType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tournamentsPerPage] = useState(10); // Количество турниров на странице
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

useEffect(() => {
  const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
  const filtered = storedTournaments
    .map((tournament) => ({ ...tournament, createdAt: new Date(tournament.createdAt) }))
    .filter(
      (tournament) =>
        tournament.title.toLowerCase().includes(searchInput.toLowerCase()) &&
        (sportType ? tournament.sportType === sportType : true) &&
        (typeTournament ? tournament.tournamentType === typeTournament : true),
    );

  // Устанавливаем общее количество страниц
  setTotalPages(Math.ceil(filtered.length / tournamentsPerPage));

  setFilteredTournaments(filtered);
  setCurrentPage(1); // Сбрасываем текущую страницу при изменении фильтров
}, [searchInput, sportType, typeTournament, tournamentsPerPage]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSportTypeChange = (event) => {
    setSportType(event.target.value);
  };
	const handleTournamentTypeChange = (event) => {
    setTournamentType(event.target.value);
  };


  const handleResetFilters = () => {
    setSearchInput('');
    setSportType('');
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="tournament">
      <div className="container">
        <h1>Все турниры и чемпионаты</h1>
        <div className="searchInput-wrapper">
          <input
            className="searchInput"
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Поиск по названию турнира"
          />
          <select className="sportType-select" value={sportType} onChange={handleSportTypeChange}>
            <option value="">Все виды спорта</option>
            {sportTypeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select className="tournamentType-select" value={typeTournament} onChange={handleTournamentTypeChange}>
            <option value="">Все типы турниров</option>
            {typeTournamentMap.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className="reset-button" onClick={handleResetFilters}>
            Сбросить фильтры
          </button>
        </div>
        <TournamentList
          searchInput={searchInput}
          sportType={sportType}
          tournamentType={typeTournament}
          currentPage={currentPage}
          tournamentsPerPage={tournamentsPerPage}
          filteredTournaments={filteredTournaments}
        />
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-btn">
            Предыдущая
          </button>
          {/* Отображаем первые 10 страниц или меньше, если их меньше */}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={pageNumber === currentPage ? 'button_active' : ''}>
              {pageNumber}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
            Следующая
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllTournaments;
