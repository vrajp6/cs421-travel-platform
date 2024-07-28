import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TravelTopia</Link>
        <ul className="navbar-menu">
          {isLoggedIn ? (
            <>
              <li><Link to="/profile" className="navbar-item">Profile</Link></li>
              <li><Link to="/dashboard" className="navbar-item">Dashboard</Link></li>
              <li><Link to="/feed" className="navbar-item">Feed</Link></li>
              <li><button onClick={onLogout} className="navbar-item navbar-button">Logout</button></li>
            </>
          ) : (
            <>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;