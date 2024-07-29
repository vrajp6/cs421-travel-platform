import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserPosts from './UserPosts';
import './ProfileStyles.css';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    travelHistory: [],
    travelPlans: []
  });
  const [newTravelPlan, setNewTravelPlan] = useState({ destination: '', date: '', details: '' });
  const [newTravelHistory, setNewTravelHistory] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/user/profile', config);
        setUser({
          id: response.data.id,
          username: response.data.username,
          bio: response.data.bio || '',
          profilePicture: response.data.profilePicture || '/api/placeholder/150/150',
          travelHistory: Array.isArray(response.data.travelHistory) ? response.data.travelHistory : [],
          travelPlans: Array.isArray(response.data.travelPlans) ? response.data.travelPlans : []
        });
        setUsername(response.data.username);
        setBio(response.data.bio || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleAddTravelPlan = async () => {
    if (newTravelPlan.destination && newTravelPlan.date) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.post('http://localhost:5000/api/user/travelPlans', newTravelPlan, config);
        setUser(prevUser => ({
          ...prevUser,
          travelPlans: Array.isArray(response.data.travelPlans) ? response.data.travelPlans : []
        }));
        setNewTravelPlan({ destination: '', date: '', details: '' });
        setShowAlert(true);
        setAlertType('success');
        setAlertMessage('Travel plan added successfully!');
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error('Error adding travel plan:', error);
      }
    }
  };

  const handleRemoveTravelPlan = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.delete(`http://localhost:5000/api/user/travelPlans/${index}`, config);
      setUser(prevUser => ({
        ...prevUser,
        travelPlans: Array.isArray(response.data.travelPlans) ? response.data.travelPlans : []
      }));
    } catch (error) {
      console.error('Error removing travel plan:', error);
    }
  };

  const handleProfileUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const profileData = {
        username: updatedUser.username,
        bio: updatedUser.bio,
        travelHistory: updatedUser.travelHistory
      };
      console.log('Updating profile with:', profileData);
      const response = await axios.put('http://localhost:5000/api/user/profile', profileData, config);
      console.log('Profile updated:', response.data);
      setUser({
        ...response.data,
        travelHistory: Array.isArray(response.data.travelHistory) ? response.data.travelHistory : [],
        travelPlans: Array.isArray(response.data.travelPlans) ? response.data.travelPlans : []
      });
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('Profile updated successfully!');
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setShowAlert({ type: 'error', message: 'Username already exists.' });
      } else {
        console.error('Error updating profile:', error);
      }
      setTimeout(() => setShowAlert({ type: '', message: '' }), 3000);
    }
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      username: username || user.username,
      bio: bio || user.bio,
      travelHistory: user.travelHistory
    };
    handleProfileUpdate(updatedUser);
  };

  const handleAddTravelHistory = () => {
    if (newTravelHistory) {
      console.log('Adding travel history:', newTravelHistory);
      const updatedUser = {
        ...user,
        travelHistory: [...user.travelHistory, newTravelHistory]
      };
      handleProfileUpdate(updatedUser);
      setNewTravelHistory('');
    }
  };

  const handleRemoveTravelHistory = (index) => {
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        travelHistory: prevUser.travelHistory.filter((_, i) => i !== index)
      };
      handleProfileUpdate(updatedUser);
      return updatedUser;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUser({ ...user, profilePicture: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
          <button onClick={() => document.getElementById('file-input').click()}>Change Profile Picture</button>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p>{user.bio}</p>
          </div>
        </div>
        
        <div className="profile-content">
          <h2>
            <span className="icon">👤</span> Edit Profile
          </h2>
          <div className="profile-edit-form">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-field"
            />
            <button onClick={handleSaveProfile}>Update Profile</button>
          </div>
          <h2>
            <span className="icon">👤</span> Travel History
          </h2>
          <div className="travel-history">
            {user.travelHistory.map((place, index) => (
              <span key={index} className="travel-tag">
                {place} <button onClick={() => handleRemoveTravelHistory(index)}>✖</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add a place"
              value={newTravelHistory}
              onChange={(e) => setNewTravelHistory(e.target.value)}
            />
            <button onClick={handleAddTravelHistory}>Add</button>
          </div>
          <h2>
            <span className="icon">📍</span> Travel Plans
          </h2>
          <div className="travel-plans">
            {user.travelPlans.map((plan, index) => (
              <div key={index} className="travel-plan">
                <div>
                  <h3>{plan.destination}</h3>
                  <p className="travel-date">
                    <span className="icon">🗓️</span> {plan.date}
                  </p>
                  {plan.details && <p className="travel-details">{plan.details}</p>}
                </div>
                <button onClick={() => handleRemoveTravelPlan(index)} className="remove-button">
                  ✖
                </button>
              </div>
            ))}
          </div>
          <div className="add-travel-plan">
            <h3>
              <span className="icon">➕</span> Add New Travel Plan
            </h3>
            <div className="travel-plan-form">
              <input
                type="text"
                placeholder="Destination"
                value={newTravelPlan.destination}
                onChange={(e) => setNewTravelPlan({ ...newTravelPlan, destination: e.target.value })}
              />
              <input
                type="date"
                value={newTravelPlan.date}
                onChange={(e) => setNewTravelPlan({ ...newTravelPlan, date: e.target.value })}
              />
              <button onClick={handleAddTravelPlan}>
                Add
              </button>
            </div>
            <input
              type="text"
              placeholder="Details (optional)"
              value={newTravelPlan.details}
              onChange={(e) => setNewTravelPlan({ ...newTravelPlan, details: e.target.value })}
              className="details-input"
            />
          </div>
        </div>
      </div>

      {showAlert && (
        <div className={`alert ${alertType}`}>
          <h4>{alertType === 'success' ? 'Success!' : 'Error!'}</h4>
          <p>{alertMessage}</p>
        </div>
      )}

      <UserPosts userId={user.id} currentUserId={user.id} />
    </div>
  );
};

export default Profile;