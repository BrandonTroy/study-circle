const express = require('express');
const connectionDao = require('../dao/connectionDao');
const userDao = require('../dao/userDao');
const chatDao = require('../dao/chatDao');
const processMessage = require('../utils/processMessage');
const { sendPush } = require('./webSocketRoutes');

// Handle subroutes
const connectionsRouter = express.Router({ mergeParams: true });

function getParameters(req) {
  return {
    userId: parseInt(req.params.userId),
    otherUserId: parseInt(req.params.otherUserId)
  };
}

// Endpoint to get a user's connections
connectionsRouter.get('/', async (req, res) => {
  const connections = await connectionDao.getTrueConnectionsByUserId(req.params.userId);
  
  // Return a list of object with friend's id and chat id
  const processedConnections = await Promise.all(connections.map(async (connection) => {
    const id = connection.sender === req.user.id ? connection.recipient : connection.sender;
    const user = await userDao.getUserByUserId(id);
    const lastMessage = await chatDao.getLatestMessage(connection.chat_id);
    return {
      ...user,
      chatId: connection.chat_id,
      lastMessage: processMessage(lastMessage),
      connection_datetime: connection.connection_datetime
    };
  }));

  res.json(processedConnections);
});

// Endpoint to get a users requested connections
connectionsRouter.get('/pending', async (req, res) => {
  connectionDao.getConnectionRequestsByUserId(req.params.userId).then(async (connections) => {
    
    // Return a list of object with friend's id and chat id
    connections = await Promise.all(connections.map(async (connection) => {
      const id = connection.sender === req.user.id ? connection.recipient : connection.sender;
      const user = await userDao.getUserByUserId(id);
      const lastMessage = await chatDao.getLatestMessage(connection.chat_id);
      return {
        ...user,
        chatId: connection.chat_id,
        lastMessage: lastMessage,
        connection_datetime: connection.connection_datetime
      };
    }));

    const uniqueConnectionsSet = new Set(connections.map(JSON.stringify));
    connections = Array.from(uniqueConnectionsSet).map(JSON.parse);

    res.json(connections);
  });
});

// Endpoint to get a connection by user ID
connectionsRouter.get('/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = getParameters(req);
    const connection = await connectionDao.getConnectionByUserIds(userId, otherUserId);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }
    const user = await userDao.getUserByUserId(otherUserId);
    const lastMessage = connection.status ? await chatDao.getLatestMessage(connection.chat_id) : null;
    res.json({
      ...user,
      chatId: connection.chat_id,
      lastMessage: lastMessage,
      connection_datetime: connection.connection_datetime,
      status: connection.status,
      sender: connection.sender
    });

  } catch (error) {
    console.error("Error getting connection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add a connection to user by user ID
connectionsRouter.post('/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = getParameters(req);

    // Add the connection
    await connectionDao.addConnection(userId, otherUserId, null);
    sendPush(otherUserId, 'New Friend Request', `@${req.user.username} added you as a friend!`);
    res.status(201).json({ message: "Connection added successfully" });
  } catch (error) {
    console.error("Error adding connection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to change the status of a connection
connectionsRouter.put('/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = getParameters(req);
    const { newStatus } = req.body;

    // Check if the connection exists
    const connectionExists = await connectionDao.checkConnection(userId, otherUserId);
    if (!connectionExists) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Change the connection status
    await connectionDao.changeConnectionStatus(userId, otherUserId, newStatus);
    const chatId = await chatDao.createChat(userId, otherUserId);
    await connectionDao.updateChatId(userId, otherUserId, chatId);
    sendPush(userId, 'New Friend', `@${req.user.username} accepted your friend request!`);
    res.json({ message: "Connection status changed successfully" });
  } catch (error) {
    console.error("Error changing connection status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to remove a connection
connectionsRouter.delete('/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = getParameters(req);

    // Check if the connection exists
    const connectionExists = await connectionDao.checkConnection(userId, otherUserId);
    if (!connectionExists) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Remove the connection
    await connectionDao.removeConnection(userId, otherUserId);
    res.json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error removing connection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = connectionsRouter;
