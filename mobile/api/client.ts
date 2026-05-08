import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  // Use your local network IP if testing on physical device, or localhost for simulator/web
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
