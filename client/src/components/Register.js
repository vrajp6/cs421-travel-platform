import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import register from '../services/registerService';
import './AuthForm.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await register(username, password);
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-left">
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Join TravelTopia and share your journey</p>
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
            <div className="form-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="modern-input"
              />
            </div>
            <button type="submit" className="submit-btn">Create Account</button>
          </form>
        </div>
        <div className="auth-form-right">
          <h2>Welcome Back</h2>
          <p>Already have an account?</p>
          <Link to="/login" className="signup-btn">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
