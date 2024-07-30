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
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Please enter your details to sign in</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="modern-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="modern-input"
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>
            <button type="submit" className="submit-btn">Sign In</button>
          </form>
        </div>
        <div className="auth-form-right">
          <h2>New to TravelTopia?</h2>
          <p>Join us and share your journey today!</p>
          <Link to="/register" className="signup-btn">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
