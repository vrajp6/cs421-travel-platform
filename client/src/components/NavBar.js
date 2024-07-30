import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TravelTopia</Link>
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="navbar-item">Profile</Link>
              <Link to="/feed" className="navbar-item">Feed</Link>
              <Link to="/search" className="navbar-item">Search</Link>
              <button onClick={onLogout} className="navbar-item navbar-button">Logout</button>
            </>
          ) : (
            <>
            </>
          )}
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
