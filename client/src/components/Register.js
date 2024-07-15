import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [travelHistory, setTravelHistory] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        bio,
        profilePicture,
        travelHistory: travelHistory.split(',').map(item => item.trim())
      });
      console.log('Registration successful', response.data);
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={profilePicture}
        onChange={e => setProfilePicture(e.target.value)}
      />
      <input
        type="text"
        placeholder="Travel History (comma-separated)"
        value={travelHistory}
        onChange={e => setTravelHistory(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
