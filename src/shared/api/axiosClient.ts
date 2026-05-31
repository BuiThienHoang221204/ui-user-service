import axios from 'axios';

const stripTrailingSlash = (value: string) => value.replace(/\/$/, '');

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;

  return (
    window.localStorage.getItem('auth_access_token') ||
    window.localStorage.getItem('authToken')
  );
};

const baseURL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || '/api-user'
);

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  const method = (config.method || 'get').toUpperCase();
  const requestUrl = `${config.baseURL || baseURL}${config.url || ''}`;

  if (import.meta.env.DEV) {
    console.info(`[axiosClient] ${method} ${requestUrl}`);
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
