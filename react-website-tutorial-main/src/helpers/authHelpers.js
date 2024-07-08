import axios from 'axios';

export const verifyCertificate = async (username) => {
  try {
    const response = await axios.post('http://localhost:5000/api/verify-certificate', { username });
    return response.data.valid;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return false;
  }
};

