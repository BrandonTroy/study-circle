import axios from 'axios';

const BASE_URL = '/api/circles';

// Get all circles to display in the circle list
export const getCircles = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

export const getCircle = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCircle = async (data) => {
  const response = await axios.post(`${BASE_URL}`, data);
  return response.data;
};

export const deleteCircle = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Handle members related to a circle

export const getCircleMembers = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/members`);
  return response.data;
};

export const addCircleMember = async (id, data) => {
  const response = await axios.post(`${BASE_URL}/${id}/members`, data);
  return response.data;
};

export const removeCircleMember = async (id, data) => {
  const response = await axios.delete(`${BASE_URL}/${id}/members`, { data });
  return response.data;
};

// Handle events related to a circle

export const getCircleEvents = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/events`);
  return response.data;
};

export const addCircleEvent = async (id, data) => {
  const response = await axios.post(`${BASE_URL}/${id}/events`, data);
  return response.data;
};

export const removeCircleEvent = async (id, data) => {
  const response = await axios.delete(`${BASE_URL}/${id}/events`, { data });
  return response.data;
};

// Handle messages related to a circle

export const getCircleMessages = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/messages`);
  return response.data;
};

export const sendCircleMessage = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}/messages`, data);
  return response.data;
};
