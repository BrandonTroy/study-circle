import axios from 'axios';

const BASE_URL = '/api/users';

export const getUser = async (id) => {
  if (id === undefined) return;
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
}

export const getProfile = async (id) => {
  if (id === undefined) return;
  const response = await axios.get(`${BASE_URL}/${id}/profile`);
  return response.data;
}

export const getFriends = async (id) => {
  if (id === undefined) return;
  const response = await axios.get(`${BASE_URL}/${id}/connections`);
  return response.data;
};

export const getFriend = async (id, friendId) => {
  if (id === undefined || friendId === undefined) return;
  const response = await axios.get(`${BASE_URL}/${id}/connections/${friendId}`);
  return response.data;
};

export const addFriend = async (id, friendId) => {
  if (id === undefined || friendId === undefined) return;
  const response = await axios.post(`${BASE_URL}/${id}/connections/${friendId}`);
  return response.data;
};

export const acceptRequest = async (id, friendId) => {
  if (id === undefined || friendId === undefined) return;
  const response = await axios.put(`${BASE_URL}/${friendId}/connections/${id}`, { newStatus: true });
  return response.data;
};

export const removeFriend = async (id, friendId) => {
  if (id === undefined || friendId === undefined) return;
  const response = await axios.delete(`${BASE_URL}/${id}/connections/${friendId}`);
  return response.data;
};

export const unsendRequest = async (id, friendId) => {
  return await removeFriend(id, friendId)
};