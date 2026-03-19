import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/user/profile');
export const updateProfile = (formData) =>
  API.put('/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
