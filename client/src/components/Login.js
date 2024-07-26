import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import login from '../services/loginService';
import './AuthForm.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      onLogin();
      navigate('/profile');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-left">
          <h2>Sign In</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button type="submit" className="submit-btn">Sign In</button>
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot Password</Link>
            </div>
          </form>
        </div>
        <div className="auth-form-right">
          <h2>Welcome to TravelTopia</h2>
          <p>Don't have an account?</p>
          <Link to="/register" className="signup-btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;