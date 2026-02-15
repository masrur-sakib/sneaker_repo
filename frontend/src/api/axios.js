import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const createNewUser = (userData) => api.post('/api/users', userData);
export const getAllUsers = () => api.get('/api/users');

// Drop APIs
export const createNewDrop = (dropData) => api.post('/api/drops', dropData);
export const getAllDrops = () => api.get('/api/drops');

// Reservation APIs
export const createNewReservation = (reservationData) =>
  api.post(`/api/reservations`, reservationData);

// Purchase APIs
export const completePurchase = (purchaseData) =>
  api.post(`/api/purchases`, purchaseData);

export default api;
