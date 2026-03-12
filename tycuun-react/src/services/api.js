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
export const getProfile = () => API.get('/users/me');
export const updateProfile = (data) => API.put('/users/update', data);
export const getPublicProfile = (id) => API.get(`/users/${id}`);
export const addEducation = (data) => API.post('/users/education', data);
export const editEducation = (eduId, data) => API.put(`/users/education/${eduId}`, data);
export const deleteEducation = (eduId) => API.delete(`/users/education/${eduId}`);
export const addExperience = (data) => API.post('/users/experience', data);
export const editExperience = (expId, data) => API.put(`/users/experience/${expId}`, data);
export const deleteExperience = (expId) => API.delete(`/users/experience/${expId}`);
