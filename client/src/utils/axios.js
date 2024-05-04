import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3007/api',
});
// К каждому запросу будем добавлять headers.Authorization с нашим токеном
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;
