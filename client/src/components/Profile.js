import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [travelHistory, setTravelHistory] = useState('');
  const [travelPlans, setTravelPlans] = useState([]);
  const [newTravelPlan, setNewTravelPlan] = useState({ destination: '', date: '', details: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/user/profile', config);
        setUser(response.data);
        setBio(response.data.bio || '');
        setProfilePicture(response.data.profilePicture || '');
        setTravelHistory(response.data.travelHistory?.join(', ') || '');
        setTravelPlans(response.data.travelPlans || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleAddTravelPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post('http://localhost:5000/api/user/travelPlans', newTravelPlan, config);
      setTravelPlans(response.data.travelPlans);
      setNewTravelPlan({ destination: '', date: '', details: '' });
    } catch (error) {
      console.error('Error adding travel plan:', error);
    }
  };

  const handleRemoveTravelPlan = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.delete(`http://localhost:5000/api/user/travelPlans/${index}`, config);
      setTravelPlans(response.data.travelPlans);
    } catch (error) {
      console.error('Error removing travel plan:', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Bio: {bio}</p>
      <p>Profile Picture: <img src={profilePicture} alt="Profile" /></p>
      <p>Travel History: {travelHistory}</p>
      <h2>Travel Plans</h2>
      <ul>
        {travelPlans && travelPlans.length > 0 ? (
          travelPlans.map((plan, index) => (
            <li key={index}>
              <p>Destination: {plan.destination}</p>
              <p>Date: {plan.date}</p>
              <p>Details: {plan.details}</p>
              <button onClick={() => handleRemoveTravelPlan(index)}>Remove</button>
            </li>
          ))
        ) : (
          <p>No travel plans available</p>
        )}
      </ul>
      <h3>Add New Travel Plan</h3>
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
      <input
        type="text"
        placeholder="Details"
        value={newTravelPlan.details}
        onChange={(e) => setNewTravelPlan({ ...newTravelPlan, details: e.target.value })}
      />
      <button onClick={handleAddTravelPlan}>Add Travel Plan</button>
    </div>
  );
};

export default Profile;
