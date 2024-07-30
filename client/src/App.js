import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import './components/styles.css';
import PostFeed from './components/PostFeed';
import Search from './components/Search'
import SearchProfile from './components/SearchProfile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/profile" element={<PrivateRoute isLoggedIn={isLoggedIn}><Profile /></PrivateRoute>} />
          <Route path="/feed" element={<PrivateRoute isLoggedIn={isLoggedIn}><PostFeed /></PrivateRoute>} />  
          <Route path="/search" element={<PrivateRoute isLoggedIn={isLoggedIn}><Search /></PrivateRoute>} />
          <Route path="/profile/:username" element={<PrivateRoute isLoggedIn={isLoggedIn}><SearchProfile /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
