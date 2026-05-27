import axios from 'axios';

// API Server Base URL
// Khi chạy production trên Vercel, chúng ta dùng rewrite /api-user để tránh lỗi Mixed Content (HTTPS -> HTTP)
const baseURL = import.meta.env.MODE === 'production' 
  ? '/api-user' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://13.239.122.251:3001');

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
