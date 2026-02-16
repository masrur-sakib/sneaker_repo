import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const createNewUser = (userData) => api.post('/api/users', userData);
export const loginUser = (email) => api.post('/api/users/login', { email });
export const getAllUsers = () => api.get('/api/users');

// Drop APIs
export const createDrop = (dropData) => api.post('/api/drops', dropData);
export const getAllDrops = () => api.get('/api/drops');
export const getDropById = (id) => api.get(`/api/drops/${id}`);

// Reservation APIs
export const createNewReservation = (reservationData) =>
  api.post(`/api/reservations`, reservationData);
export const cancelReservation = (id) => api.delete(`/api/reservations/${id}`);

// Purchase APIs
export const completePurchase = (purchaseData) =>
  api.post(`/api/purchases`, purchaseData);

export default api;
