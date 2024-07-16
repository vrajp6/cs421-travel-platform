import axios from 'axios';

const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export default login;
