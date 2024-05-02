import axios from 'axios';

const BASE_URL = '/api/users';

export const getNotifications = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/notifications`);
  return response.data;
}