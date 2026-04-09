import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const api = axios.create({ baseURL: API_BASE });

// Attach Authorization header from localStorage on each request
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore
  }
  return config;
});

export async function register(payload) {
  const res = await api.post('/api/auth/register', payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post('/api/auth/login', payload);
  return res.data;
}

export async function simulate(payload) {
  const res = await api.post('/api/simulate', payload);
  return res.data;
}

export async function compareAlgorithms(payload) {
  const res = await api.post('/api/compare', payload);
  return res.data;
}

export async function createSavedSimulation(payload) {
  const res = await api.post('/api/simulations', payload);
  return res.data;
}

export async function listSavedSimulations() {
  const res = await api.get('/api/simulations');
  return res.data;
}

export async function deleteSavedSimulation(id) {
  const res = await api.delete(`/api/simulations/${id}`);
  return res.data;
}
