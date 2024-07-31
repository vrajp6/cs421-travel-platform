import React, { useState } from 'react';
import axios from 'axios';
import './PostStyles.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };


  
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/images/uploadimageFile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Image upload response:', response.data);
      return response.data.imageFile; // Updated to use `imageFile`
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = null;
      if (imageFile) {
        const imageUploadResponse = await uploadImage();
        imagePath = imageUploadResponse;  // Upload the image and get the path
      }

      const postData = {
        content,
        location,
        imageUrl: imagePath, // Use the correct field name expected by backend
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onPostCreated(response.data);
      setContent('');
      setLocation('');
      setImageFile(null);
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
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;