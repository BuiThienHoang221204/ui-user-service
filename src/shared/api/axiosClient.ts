import axios from 'axios';

// API Server Base URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://13.239.122.251:3001';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
