import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

const UserPosts = ({ userId, currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log('Fetching posts for user ID:', userId);
        const response = await axios.get(`http://localhost:5000/api/posts/user/${userId}`);
        console.log('Received posts:', response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    } else {
      console.log('No userId provided');
      setLoading(false);
    }
  }, [userId]);

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-posts">
      <h2>User Posts</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            onDelete={handlePostDeleted} 
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
};

export default UserPosts;