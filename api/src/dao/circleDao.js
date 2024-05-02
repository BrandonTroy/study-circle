
const db = require('./DBConnection');
const processCircle = require('../utils/processCircle');

// Endpoint to get a circle by circle id
async function getCircleByCircleId(circleId) {
  const query = `
    SELECT * FROM circle WHERE circle_id = ?
  `;
  const result = await db.query(query, [circleId]);
  const circle = result.results[0];
  return processCircle(circle);
}

async function getCirclesByCourseCode(courseCode) {
  const query = `SELECT * FROM circle WHERE course_code = ?`;
  const result = await db.query(query, [courseCode]);
  const circles = result.results;
  return circles.map(processCircle);
}

// Endpoint to create a circle
async function createCircle(name, description, owner, public, courseCode, chatId) {
  const query = `
    INSERT INTO circle (name, description, owner, \`public\`, course_code, chat_id) VALUES (?, ?, ?, ?, ?, ?)
  `;
  const result = await db.query(query, [name, description, owner, public, courseCode, chatId]);
  return result.results.insertId;
}

// Endpoint to change circle public status
function updatePublicStatus(status, circleId) {
  const query = `
    UPDATE circle SET public = ? WHERE circle_id = ?
  `;
  db.query(query, [status, circleId]).then(result => {
    console.log("Result of update query: ", result);
  });
}

module.exports = {
  getCircleByCircleId: getCircleByCircleId,
  getCirclesByCourseCode: getCirclesByCourseCode,
  createCircle: createCircle,
  updatePublicStatus: updatePublicStatus
}