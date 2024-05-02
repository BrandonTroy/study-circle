
const db = require('./DBConnection');
const processEvent = require('../utils/processEvent')

// Endpoint to get events by circle
async function getEventsByCircle(circleId) {
  const query = `
    SELECT * FROM event WHERE circle_id = ?
  `;
  const result = await db.query(query, [circleId]);
  const events = result.results;
  return events.map(processEvent);
}

// Endpoint to add an event to a circle
function addEventToCircle(title, description, date, location, startTime, endTime, circleId) {
  const query = `
    INSERT INTO event (title, description, date, location, start_time, end_time, circle_id) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [title, description, date, location, startTime, endTime, circleId]).then(result => {
    console.log("Result of insert query: ", result);
  });
}

// Endpoint to delete an event
function deleteEvent(eventId) {
  const query = `
    DELETE FROM event WHERE event_id = ?
  `;
  db.query(query, [eventId]).then(result => {
    console.log("Result of delete query: ", result);
  });
}

module.exports = {
  getEventsByCircle: getEventsByCircle,
  addEventToCircle: addEventToCircle,
  deleteEvent: deleteEvent
};
