import React, { useState } from 'react';
import axios from 'axios';
import './PostStyles.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/posts', 
        { content, location, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostCreated(response.data);
      setContent('');
      setLocation('');
      setImageUrl('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;