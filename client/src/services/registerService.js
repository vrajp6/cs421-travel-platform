import axios from 'axios';

const register = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export default register;
