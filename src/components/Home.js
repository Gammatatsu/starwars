import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HistoryContext } from '../App';

// Импортируем useDebounce 
import useDebounce from './useDebounce';

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { history, setHistory } = useContext(HistoryContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const historyLimit = 10; // Максимальное количество элементов в истории просмотра
  const charactersPerPage = 10; // Количество персонажей на одной странице

  // Используем функцию useDebounce для задержки поискового запроса
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        let url = 'https://swapi.dev/api/people/';
        if (debouncedSearchTerm) {
          url += `?search=${debouncedSearchTerm}`;
        } else {
          url += `?page=${currentPage}`;
        }
        const response = await axios.get(url);
        setCharacters(response.data.results);
        setTotalPages(Math.ceil(response.data.count / charactersPerPage));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCharacters();
  }, [debouncedSearchTerm, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const addToHistory = (character) => {
  //   const updatedHistory = [character, ...history.filter((id) => id !== getCharacterIdFromUrl(character.url))].slice(0, historyLimit);
  //   setHistory(updatedHistory);

  // };
  const addToHistory = (character) => {
    const characterId = getCharacterIdFromUrl(character.url);
    const updatedHistory = [character, ...history.filter((item) => getCharacterIdFromUrl(item.url) !== characterId)].slice(0, historyLimit);
    setHistory(updatedHistory);
  };

  // const removeFromHistory = (characterId) => {
  //   const updatedHistory = history.filter((id) => id !== characterId);
  //   setHistory(updatedHistory);
  // };

  const getCharacterIdFromUrl = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className='content'>
      <div className='container'>

        <h1 className='content__title'>Star Wars Characters</h1>
        <div className='content__search'>
        <input
          // className='content__search'
          type="text"
          placeholder="Search characters"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        </div>
        <ul className='content__character-list'>
          {characters.map((character) => (
            <li className='content__character-item' key={character.url}>
              <Link
                to={`/character/${getCharacterIdFromUrl(character.url)}`}
                onClick={() => addToHistory(character)}
              >
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
        {history.length > 0 && (
          <div className='content__history'>
            <h2 className='content__history-title'>История</h2>
            <ul className='content__history-list'>
              {history.map((character) => (
                <li className='s' key={character.url}>
                  <Link to={`/character/${getCharacterIdFromUrl(character.url)}`}>
                    {character.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='content__buttons'>
          {currentPage > 1 && (
            <button className='content__buttons-prev' onClick={() => handlePageChange(currentPage - 1)}>
              Предыдущая страница
            </button>
          )}
          {currentPage < totalPages && (
            <button className='content__buttons-prev' onClick={() => handlePageChange(currentPage + 1)}>
              Следующая страница
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default Home;