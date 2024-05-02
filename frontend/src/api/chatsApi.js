import axios from 'axios';

const BASE_URL = '/api/chats';

export const getMessages = async (id) => {
  if (id === undefined) return;
  const response = await axios.get(`${BASE_URL}/${id}/messages`);
  return response.data;
}

export const sendMessage = async (id, data) => {
  if (id === undefined) return;
  const response = await axios.post(`${BASE_URL}/${id}`, data);
  return response.data;
}