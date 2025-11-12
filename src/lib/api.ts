// src/lib/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://server-yavuli.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  signup: (userData: any) => 
    api.post('/auth/signup', userData),
  test: () => 
    api.get('/auth'),
};


// In src/lib/api.ts
export const listingsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/listings');
      console.log('Raw API Response:', response);
      
      // Handle case where response.data is the array directly
      if (Array.isArray(response.data)) {
        return response.data.map(transformListing);
      }
      
      // Handle case where response.data is an object with a data property
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformListing);
      }
      
      // Handle case where response.data is an object with a listings property
      if (response.data && response.data.listings) {
        return Array.isArray(response.data.listings) 
          ? response.data.listings.map(transformListing)
          : [response.data.listings].map(transformListing);
      }
      
      // If we get here, the response format is unexpected
      console.warn('Unexpected API response format:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },
};

// Helper function to transform listing data
function transformListing(listing: any) {
  return {
    id: listing.id || Math.random().toString(36).substr(2, 9),
    title: listing.title || 'Untitled Listing',
    price: listing.price || 0,
    images: Array.isArray(listing.images) ? listing.images : [],
    location_city: listing.location || listing.location_city || 'N/A',
    college_name: listing.college_name || 'Your College',
    condition: listing.condition || 'N/A',
    views: listing.views || 0,
    favorites: listing.favorites || 0,
    verified: listing.verified || false,
  };
}

export const reportsAPI = {
  submitReport: (reportData: any) => 
    api.post('/reports', reportData),
};