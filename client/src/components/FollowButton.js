import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        console.log('Fetching follow status for user ID:', userId);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/follow/status/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Received follow status: ', response.data);
        setFollowing(response.data.isFollowing); // Ensure this matches the response structure
      } catch (error) {
        console.error('Failed to fetch follow status:', error);
      }
    };

    if (userId) {
      checkFollowStatus();
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/follow/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFollowing(true);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/unfollow/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFollowing(false);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  return (
    <button onClick={following ? handleUnfollow : handleFollow}>
      {following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;