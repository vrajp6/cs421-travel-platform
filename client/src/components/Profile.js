import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/user/profile', config);
        setUser({
          username: response.data.username,
          bio: response.data.bio || '',
          profilePicture: response.data.profilePicture || '/api/placeholder/150/150',
          travelHistory: response.data.travelHistory || [],
          travelPlans: response.data.travelPlans || []
        });
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
          travelPlans: response.data.travelPlans
        }));
        setNewTravelPlan({ destination: '', date: '', details: '' });
        setShowAlert(true);
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
        travelPlans: response.data.travelPlans
      }));
    } catch (error) {
      console.error('Error removing travel plan:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p>{user.bio}</p>
          </div>
        </div>
        
        <div className="profile-content">
          <h2>
            <span className="icon">👤</span> Travel History
          </h2>
          <div className="travel-history">
            {user.travelHistory.map((place, index) => (
              <span key={index} className="travel-tag">
                {place}
              </span>
            ))}
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
        <div className="alert">
          <h4>Success!</h4>
          <p>Your travel plan has been added.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;