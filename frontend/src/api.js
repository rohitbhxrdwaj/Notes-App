import axios from 'axios';

/**
 * API Configuration
 * 
 * This file sets up the Axios instance with base URL
 * and adds interceptors to include JWT token in all requests
 */

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

/**
 * Request Interceptor
 * Adds Authorization header with JWT token to all requests
 */
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common errors like unauthorized access (401)
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
};

// Notes API endpoints
export const notesAPI = {
  getAllNotes: () => API.get('/notes'),
  createNote: (data) => API.post('/notes', data),
  deleteNote: (id) => API.delete(`/notes/${id}`),
  summarizeNote: (id) => API.post(`/notes/${id}/summarize`),
};

export default API;
