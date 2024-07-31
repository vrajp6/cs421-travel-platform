import React, { useState, useRef } from 'react';
import axios from 'axios';
import './PostStyles.css';
import { Upload, X } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setFileName('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      setImagePreview(null);
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
        <div className="file-input-container">
          <button type="button" onClick={handleFileButtonClick} className="file-input-button">
            <Upload size={18} /> Choose Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {fileName && (
            <div className="file-name-container">
              <span className="file-name">{fileName}</span>
              <button type="button" onClick={handleRemoveFile} className="remove-file-button">
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        {imagePreview && (
          <div className="image-preview-container">
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          </div>
        )}
        <button type="submit" className="submit-button">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
