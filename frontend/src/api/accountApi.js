import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { subscribeToPush } from '../notifications.js';

const BASE_URL = '/api/account';


export const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  subscribeToPush(response.data.user.id);
  return response.data;
}

export const logout = async () => {
  // Unregister all service workers
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (let registration of registrations) {
    registration.unregister();
  }
  // Clear all caches
  if ('caches' in window) {
    const keys = await caches.keys();
    for (let key of keys) {
      await caches.delete(key);
    }
  }
  // Clear the token
  Cookies.remove('StudyCircleToken');
  axios.post(`${BASE_URL}/logout`);
}

export const signup = async (data) => {
  const response = await axios.post(`${BASE_URL}/signup`, data);
  subscribeToPush(response.data.user.id);
  return response.data;
}

export const getCurrentUser = async (refresh=true) => {
  const token = Cookies.get('StudyCircleToken');
  if (!token) {
    if (refresh) window.location.reload();
    return null;
  }
  return jwtDecode(token).user;
}