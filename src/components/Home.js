import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HistoryContext } from '../App';

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { history, setHistory } = useContext(HistoryContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const historyLimit = 10; // Максимальное количество элементов в истории просмотра
  const charactersPerPage = 10; // Количество персонажей на одной странице

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${currentPage}`);
        setCharacters(response.data.results);
        setTotalPages(Math.ceil(response.data.count / charactersPerPage));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addToHistory = (character) => {
    const updatedHistory = [character, ...history.filter((id) => id !== getCharacterIdFromUrl(character.url))].slice(0, historyLimit);
    setHistory(updatedHistory);
  };

  const removeFromHistory = (characterId) => {
    const updatedHistory = history.filter((id) => id !== characterId);
    setHistory(updatedHistory);
  };

  const getCharacterIdFromUrl = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='wrapper'>
      <section className='content' >
        <h1 className='content__title'>Star Wars Characters</h1>
        <input className='content__search' type="text" placeholder="Search characters" value={searchTerm} onChange={handleSearchChange} />
        <ul className='content__character-list'>
          {filteredCharacters.map((character) => (
            <li className='content__character-item' key={character.url}>
              <Link to={`/character/${getCharacterIdFromUrl(character.url)}`} onClick={() => addToHistory(character)}>
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
                <li className='content__history-item' key={character.url}>
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
            <button className='content__buttons-prev' onClick={() => handlePageChange(currentPage - 1)}>Предыдущая страница</button>
          )}
          {currentPage < totalPages && (
            <button className='content__buttons-prev' onClick={() => handlePageChange(currentPage + 1)}>Следующая страница</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;