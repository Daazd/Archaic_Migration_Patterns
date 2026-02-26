import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMovements = async (filters = {}) => {
  try {
    const response = await api.get('/movements', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    return [];
  }
};

export const getMovementById = async (id) => {
  try {
    const response = await api.get(`/movements/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching movement:', error);
    return null;
  }
};

export const extractMovementsFromPassage = async (book, chapter, startVerse, endVerse) => {
  try {
    const response = await api.post('/movements/extract', {
      book,
      chapter,
      startVerse,
      endVerse
    });
    return response.data.data;
  } catch (error) {
    console.error('Error extracting movements:', error);
    return [];
  }
};
