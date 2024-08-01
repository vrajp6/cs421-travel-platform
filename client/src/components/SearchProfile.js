import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserPosts from './UserPosts';
import FollowButton from './FollowButton'; //follow button file
import './ProfileStyles.css';

const SearchProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/profile/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };


    fetchProfile();
    fetchCurrentUser();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.profilePicture || '/images/default-picture.jpg'} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <h1>{user.username}</h1>
            <FollowButton userId={user.id} isFollowing={isFollowing} />
            <p>{user.bio}</p>
          </div>
        </div>
        <div className="profile-content">
          <h2>Travel History</h2>
          <div className="travel-history">
            {user.travelHistory && user.travelHistory.length > 0 ? (
              user.travelHistory.map((place, index) => (
                <span key={index} className="travel-tag">
                  {place}
                </span>
              ))
            ) : (
              <p>No travel history available.</p>
            )}
          </div>
          <h2>Travel Plans</h2>
          <div className="travel-plans">
            {user.travelPlans && user.travelPlans.length > 0 ? (
              user.travelPlans.map((plan, index) => (
                <div key={index} className="travel-plan">
                  <div>
                    <h3>{plan.destination}</h3>
                    <p className="travel-date">{plan.date}</p>
                    {plan.details && <p className="travel-details">{plan.details}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p>No travel plans available.</p>
            )}
          </div>
        </div>
      </div>
      <UserPosts userId={user.id} currentUserId={currentUserId} />
    </div>
  );
};

export default SearchProfile;