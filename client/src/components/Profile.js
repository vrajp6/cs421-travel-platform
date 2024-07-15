import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [travelHistory, setTravelHistory] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5000/api/user/profile', config);
      setUser(response.data);
      setBio(response.data.bio || '');
      setProfilePicture(response.data.profilePicture || '');
      setTravelHistory(response.data.travelHistory ? response.data.travelHistory.join(', ') : '');
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put('http://localhost:5000/api/user/profile', {
        bio,
        profilePicture,
        travelHistory: travelHistory.split(',').map(item => item.trim())
      }, config);
      setUser(response.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Bio: {user.bio}</p>
      <p>Profile Picture: <img src={user.profilePicture} alt="Profile" /></p>
      <p>Travel History: {user.travelHistory && user.travelHistory.join(', ')}</p>

      <h2>Update Profile</h2>
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
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default Profile;