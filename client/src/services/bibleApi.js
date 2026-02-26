import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBibleStructure = async () => {
  try {
    const response = await api.get('/bible/structure');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Bible structure:', error);
    return {}; // Return empty object as fallback
  }
};

export const getBibleText = async (translation, book, chapter, verse) => {
  try {
    const response = await api.get(`/bible/passage/${book}/${chapter}/${verse}`);
    return response.data.data.text;
  } catch (error) {
    console.error('Error fetching Bible text:', error);
    return 'Error loading text';
  }
};

export const searchBible = async (query, limit = 20) => {
  try {
    const response = await api.get('/bible/search', {
      params: { query, limit }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching Bible:', error);
    return [];
  }
};
