import React from 'react';
import axios from 'axios';
import './PostStyles.css';

const Post = ({ post, onDelete, currentUserId }) => {
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
            {post.location && <p className="location">{post.location}</p>}
          </div>
        </div>
        {post.userId === currentUserId && (
          <button onClick={handleDelete} className="delete-button">Delete</button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
      <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default Post;