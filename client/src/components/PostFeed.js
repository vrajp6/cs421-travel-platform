import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Post from './Post';
import CreatePost from './CreatePost';
import './PostStyles.css';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, [fetchPosts, fetchCurrentUser]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="post-feed">
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.length === 0 ? (
        <div className="no-posts">No posts yet. Be the first to share!</div>
      ) : (
        posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            onDelete={handlePostDeleted} 
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
};

export default PostFeed;
