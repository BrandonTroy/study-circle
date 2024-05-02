import axios from 'axios';

const BASE_URL = '/api';

export const getEvents = async () => {
  const response = await axios.get(`${BASE_URL}/events`);
  return response.data;
};

export const createEvent = async (data) => {
  const response = await axios.post(`${BASE_URL}/events`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${BASE_URL}/events/${id}`);
  return response.data;
};
