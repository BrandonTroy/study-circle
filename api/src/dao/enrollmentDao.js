
const db = require('./DBConnection');
const circleDao = require('./circleDao');
const processUser = require('../utils/processUser');
const processCourse = require('../utils/processCourse');

// Endpoint to enroll a user
function enrollUser(userId, courseCode) {
  const query = 'INSERT INTO enrollment (user_id, course_code) VALUES (?, ?)';
  db.query(query, [userId, courseCode]).then(result => {
    console.log("Result of insert query: ", result);
  });
}

// Endpoint to unenroll a user
function unenrollUser(userId, courseCode) {
  const query = `DELETE FROM enrollment WHERE user_id = ? AND course_code = ?`;
  db.query(query, [userId, courseCode]).then(result => {
    console.log("Result of delete query: ", result);
  });
}

// Endpoint to get all users enrolled in a course
async function getEnrolledUsers(courseCode) {
  const query = `
    SELECT u.*
    FROM user u
    INNER JOIN enrollment e ON u.user_id = e.user_id
    WHERE e.course_code = ?
  `;
  const result = await db.query(query, [courseCode]);
  const users = result.results;
  return users.map(processUser);
}

// Endpont to get all courses a user is enrolled in
async function getUserEnrollment(userId) {
  const query = `SELECT course_code FROM enrollment WHERE user_id = ?`;
  const result = await db.query(query, [userId]);
  const courses = result.results;
  await Promise.all(courses.map(async course => {
    const circles = await circleDao.getCirclesByCourseCode(course.course_code);
    course.circles = circles;
  }));
  return courses.map(processCourse);
}

module.exports = {
  enrollUser: enrollUser,
  unenrollUser: unenrollUser,
  getEnrolledUsers: getEnrolledUsers,
  getUserEnrollment: getUserEnrollment
}