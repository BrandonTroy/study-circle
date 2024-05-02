
const db = require('./DBConnection');
const processUser = require('../utils/processUser');
const processCircle = require('../utils/processCircle');


// Endpoint to add a new membership
function addMembership(userId, circleId) {
  const query = `
    INSERT INTO membership (user_id, circle_id) VALUES (?, ?)
  `;
  db.query(query, [userId, circleId]).then(result => {
    console.log("Result of insert query: ", result);
  });
}

// Endpoint to get all members of a circle
async function getMembersByCircleId(circleId) {
  const query = `
    SELECT u.* 
    FROM user u 
    INNER JOIN membership m ON u.user_id = m.user_id 
    WHERE m.circle_id = ?
  `;
  const result = await db.query(query, [circleId]);
  const users = result.results;
  return users.map(processUser);
}

// Endpoint to get all circles a user is a member of
async function getCirclesByUserId(userId) {
  const query = `
    SELECT c.* 
    FROM circle c 
    INNER JOIN membership m ON c.circle_id = m.circle_id 
    WHERE m.user_id = ?
  `;
  const result = await db.query(query, [userId]);
  const circles = result.results;
  return circles.map(processCircle);
}

module.exports = {
  addMembership: addMembership,
  getMembersByCircleId: getMembersByCircleId,
  getCirclesByUserId: getCirclesByUserId
};