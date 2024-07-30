import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, User, MapPin } from 'lucide-react';
import './SearchStyles.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/user/search?query=${query}`);
      setResults(response.data);
      setError('');
    } catch (error) {
      setError('No users found or server error');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <h1>Discover Fellow Travelers</h1>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search by username or travel history"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : <SearchIcon size={24} />}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="results">
        {results.map((user) => (
          <Link to={`/profile/${user.username}`} key={user.id} className="result-item">
            <div className="result-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="result-info">
              <h3>{user.username}</h3>
              <p>{user.bio}</p>
              {user.travelHistory && user.travelHistory.length > 0 && (
                <div className="travel-history">
                  <MapPin size={18} />
                  <span>{user.travelHistory[0]}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
