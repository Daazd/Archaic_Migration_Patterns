import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHistoricalLocations = async () => {
  try {
    const response = await api.get('/locations');
    const locations = {};
    
    response.data.data.forEach(location => {
      locations[location.name] = {
        coords: location.coords,
        period: location.period,
        region: location.region,
        alternateNames: location.alternateNames || [],
        importance: location.importance
      };
    });
    
    return locations;
  } catch (error) {
    console.error('Error fetching historical locations:', error);
    // Return fallback data
    return {
      'Jerusalem': {
        coords: [35.2137, 31.7683],
        period: [-1000, 2025],
        region: 'Judea',
        alternateNames: ['Yerushalayim'],
        importance: 'major'
      }
    };
  }
};
