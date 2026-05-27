import axios from 'axios';

// API Server Base URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
