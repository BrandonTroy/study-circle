
const db = require('./DBConnection');
const processConnection = require('../utils/processConnection');

// Endpoint to add a new connection
function addConnection(senderId, recipientId, chatId) {
  const query = `
    INSERT INTO connection (sender, recipient, chat_id, connection_datetime) VALUES (?, ?, ?, ?)
  `;
  db.query(query, [senderId, recipientId, chatId, new Date()]).then(result => {
    console.log("Result of insert query: ", result);
  });
}

// Endpoint to change the status of a connection
function changeConnectionStatus(senderId, recipientId, newStatus) {
  const query = `
    UPDATE connection SET status = ? WHERE sender = ? AND recipient = ?
  `;
  db.query(query, [newStatus, senderId, recipientId]).then(result => {
    console.log("Result of update query: ", result);
  });
}

function updateChatId(senderId, recipientId, chatId) {
  const query = `
    UPDATE connection SET chat_id = ? WHERE sender = ? AND recipient = ?
  `;
  db.query(query, [chatId, senderId, recipientId]).then(result => {
    console.log("Result of update query: ", result);
  });
}

// Endpoint to get connections by user id
async function getConnectionsByUserId(userId) {
  const query = `
    SELECT * FROM connection WHERE sender = ? OR recipient = ?
  `;
  const result = await db.query(query, [userId, userId]);
  const connections = result.results;
  return connections.map(processConnection);
}

// Endpoint to get pending connections
async function getConnectionRequestsByUserId(userId) {
  const query = `
    SELECT * FROM connection WHERE recipient = ? AND status = FALSE
  `;
  const result = await db.query(query, [userId]);
  const connections = result.results;
  return connections.map(processConnection);
}

// Endpoint to get accepted connections by user id
async function getTrueConnectionsByUserId(userId) {
  const query = `
    SELECT * FROM connection WHERE (sender = ? OR recipient = ?) AND status = TRUE
  `;
  const result = await db.query(query, [userId, userId]);
  const connections = result.results;
  return connections.map(processConnection);
}

async function getConnectionByUserIds(userId, otherUserId) {
  const query = `
    SELECT * FROM connection WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
  `;
  const result = await db.query(query, [userId, otherUserId, otherUserId, userId]);
  if (result.results.length === 0) {
    return null;
  }
  return processConnection(result.results[0]);
};

// Endpoint to remove a connection
async function removeConnection(senderId, recipientId) {
  const result = await db.query(
    `SELECT chat_id FROM connection WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)`,
    [senderId, recipientId, recipientId, senderId]
  );
  await db.query(
    `DELETE FROM connection WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)`,
    [senderId, recipientId, recipientId, senderId]
  );
  await db.query(
    `UPDATE chat SET latest_message_id = NULL WHERE chat_id = ?`,
    [result.results[0].chat_id]
  );
  await db.query('DELETE FROM message WHERE chat_id = ?', [result.results[0].chat_id]);
  await db.query('DELETE FROM chat WHERE chat_id = ?', [result.results[0].chat_id]);
}

async function getConnectedUserIds(userId) {
  console.log("Getting connected user ids for user: ", userId);
  const query = `
    SELECT sender, recipient FROM connection WHERE (sender = ? OR recipient = ?) AND status = TRUE
  `;
  const result = await db.query(query, [userId, userId]);
  const connections = result.results;
  return connections.map(connection => connection.sender == userId ? connection.recipient : connection.sender);
}

async function checkConnection(userId, recipientId) {
  const query = `
    SELECT sender, recipient FROM connection WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) AND status = TRUE
  `
  const result = await db.query(query, [userId, recipientId, recipientId, userId]);
  return result.results.length > 0;
}

module.exports = {
  addConnection: addConnection,
  changeConnectionStatus: changeConnectionStatus,
  updateChatId: updateChatId,
  getConnectionsByUserId: getConnectionsByUserId,
  getTrueConnectionsByUserId: getTrueConnectionsByUserId,
  getConnectionByUserIds: getConnectionByUserIds,
  getConnectionRequestsByUserId: getConnectionRequestsByUserId,
  removeConnection: removeConnection,
  getConnectedUserIds: getConnectedUserIds,
  checkConnection: checkConnection
};
