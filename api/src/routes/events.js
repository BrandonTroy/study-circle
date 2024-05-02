const express = require('express');
const eventDao = require('../dao/eventDao');

// Handle subroutes
const eventsRouter = express.Router();

// Endpoint to get events by circle ID
eventsRouter.get('/', async (req, res) => {
  try {
    const { circleId } = req.params;
    const events = await eventDao.getEventsByCircle(circleId);
    res.json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add an event to a circle
eventsRouter.post('/', async (req, res) => {
  try {
    const { circleId } = req.params;
    const { title, description, date, location, startTime, endTime } = req.body;

    // Add the event to the circle
    eventDao.addEventToCircle(title, description, date, location, startTime, endTime, circleId);

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete event
eventsRouter.delete('/eventId', async (req, res) => {
  try {
    const { circleId, eventId } = req.params;

    // Delete event
    eventDao.deleteEvent(eventId);

    res.status(201).json({ message: "Event sucessfully deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = eventsRouter;