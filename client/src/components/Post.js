import React, { useState } from 'react';
import axios from 'axios';
import { ThumbsUp } from 'lucide-react';
import './PostStyles.css';

const Post = ({ post, onDelete, currentUserId }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isLiked ? 'unlike' : 'like';
      const response = await axios.post(`http://localhost:5000/api/posts/${post.id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="user-info">
          <img 
            src={post.User?.profilePicture || '/images/default-avatar.png'} 
            alt="User avatar" 
            className="avatar" 
          />
          <div className="post-info">
            <h3>{post.User?.username || 'Unknown User'}</h3>
            <p className="location">{post.User?.location || 'USA'}</p>
          </div>
        </div>
        {post.userId === currentUserId && (
          <button onClick={handleDelete} className="delete-button">Delete</button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
      <div className="post-actions">
        <button 
          onClick={handleLikeToggle} 
          className={`like-button ${isLiked ? 'liked' : ''}`}
        >
          <ThumbsUp size={16} />
          <span>{isLiked ? 'Liked' : 'Like'}</span>
          <span className="like-count">({likes})</span>
        </button>
      </div>
      <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default Post;