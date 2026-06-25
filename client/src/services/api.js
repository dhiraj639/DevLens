import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Connect to Node Express Port 8080
});

// Automatically inject JWT authentication token in headers
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;

