import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchStyles.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/search?query=${query}`);
      setResults(response.data);
      setError('');
    } catch (error) {
      setError('No users found or server error');
      setResults([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by username or travel history"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <div className="error">{error}</div>}
      <div className="results">
        {results.map((user) => (
          <div key={user.id} className="result-item">
            <Link to={`/profile/${user.username}`} className="result-link">
              <img src={user.profilePicture || '/images/default-picture.jpg'} alt="Profile" className="result-picture" />
              <div className="result-info">
                <h3>{user.username}</h3>
                <p>{user.bio}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
