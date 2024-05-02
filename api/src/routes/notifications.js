const express = require('express');
const connectionDao = require('../dao/connectionDao');
const userDao = require('../dao/userDao');
const { sendPush } = require('./webSocketRoutes');

// Handle subroutes
const notificationsRouter = express.Router({ mergeParams: true });

// Endpoint to get specific user's notifications
notificationsRouter.get('/', (req, res) => {
  const processConnections = async () => {
    const connections = await connectionDao.getConnectionsByUserId(req.params.userId);
    const promises = connections.filter(connection => connection.recipient == req.params.userId).map(async (connection) => {
      const other = await userDao.getUserByUserId(connection.sender);
      Object.assign(connection, other);
      delete connection.sender;
      delete connection.recipient;
      return connection;
    });
    return Promise.all(promises);
  };

  processConnections().then(result => {
    res.json(result);
  });
});

// Endpoint to send a new notification
notificationsRouter.post('/', (req, res) => {
  sendPush(req.params.userId, req.body.title, req.body.message);
  res.send("Notification sent successfully");
});

module.exports = notificationsRouter;
