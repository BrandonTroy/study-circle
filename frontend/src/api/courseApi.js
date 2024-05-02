import axios from 'axios';

const BASE_URL = '/api';

// Get all courses
export const getCourses = async () => {
  const response = await axios.get(`${BASE_URL}/courses`);
  return response.data;
};

// Get all courses to display in the class list
export const getEnrolledCourses = async (id) => {
  const response = await axios.get(`${BASE_URL}/users/${id}/enrollment`);
  return response.data;
};

// Get the detail data of a class
export const getCirclesInCourse = async (code) => {
  const response = await axios.get(`${BASE_URL}/courses/${code}/circles`);
  return response.data;
};

// Handle circles related to a class
export const addCircleToCourse = async (code, circleId) => {
  const response = await axios.post(`${BASE_URL}/courses/${code}/circles/${circleId}`);
  return response.data;
};

export const removeCircleFromCourse = async (code, circleId) => {
  const response = await axios.delete(`${BASE_URL}/courses/${code}/circles/${circleId}`);
  return response.data;
};

// Handle students related to a class
export const getStudentsInCourse = async (code) => {
  const response = await axios.get(`${BASE_URL}/courses/${code}/students`);
  return response.data;
};

export const addStudentToCourse = async (code, studentId) => {
  const response = await axios.post(`${BASE_URL}/courses/${code}/students/${studentId}`);
  return response.data;
};

export const removeStudentFromCourse = async (code, studentId) => {
  const response = await axios.delete(`${BASE_URL}/courses/${code}/students/${studentId}`);
  return response.data;
};
