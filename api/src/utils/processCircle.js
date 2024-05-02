
/**
 * Processes the circle object returned from the database to match the expected format
 * @param {Object} circle the circle object returned from the database
 * @returns the circle object with the expected format
 */
function processCircle(circle) {
  if (!circle) return {};
  circle.id = circle.circle_id;
  delete circle.circle_id;
  circle.public = Boolean(circle.public);
  return circle;
}

module.exports = processCircle;