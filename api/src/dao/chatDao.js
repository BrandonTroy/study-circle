
const db = require('./DBConnection');
const processMessage = require('../utils/processMessage');

// Endpoint to get chat by id
async function getChatByChatId(chatId) {
  const query = `
    SELECT * FROM chat WHERE chat_id = ?
  `;
  const result = await db.query(query, [chatId]);
  const chat = result.results[0];
  return chat;
}

// Endpoint to create a chat
async function createChat() {
  const query = `
    INSERT INTO chat (latest_message_id) VALUES (NULL)
  `;
  const result = await db.query(query);
  console.log("Result of create query: ", result);
  return result.results.insertId;
}

// Endpoint to update the latest message
function updateLatestMessage(messageId, chatId) {
  const query = 'UPDATE chat SET latest_message = ? WHERE chat_id = ?';
  return db.query(query, [messageId, chat_id]).then(result  => {
    console.log("Result of update query: ", result);
  });
}

// Endpoint to get the latest message
async function getLatestMessage(chatId) {
  let result = await db.query('SELECT latest_message_id FROM chat WHERE chat_id = ?', [chatId]);
  if (!result.results[0]) return null;
  const latestMessageId = result.results[0].latest_message_id;
  result = await db.query('SELECT * FROM message WHERE message_id = ?', [latestMessageId]);
  const latestMessage = result.results[0];
  return latestMessage;
}

async function sendMessage(chatId, senderId, content) {
  const date = new Date();
  const query = `
    INSERT INTO message (chat_id, sender_id, content, send_datetime) VALUES (?, ?, ?, ?)
  `;
  const insertResult = await db.query(query, [chatId, senderId, content, date]);
  console.log("Result of send query: ", insertResult);
  const updateResult = await db.query('UPDATE chat SET latest_message_id = ? WHERE chat_id = ?', [insertResult.results.insertId, chatId]);
  console.log("Result of update query: ", updateResult);
}

// Endpoint to get messages by chat id
async function getMessagesByChatId(chatId) {
  const query = `
    SELECT * FROM message WHERE chat_id = ?
  `;
  const result = await db.query(query, [chatId]);
  const messages = result.results;
  return messages.map(processMessage);
}


module.exports = {
  getChatByChatId: getChatByChatId,
  createChat: createChat,
  updateLatestMessage: updateLatestMessage,
  getLatestMessage: getLatestMessage,
  sendMessage: sendMessage,
  getMessagesByChatId: getMessagesByChatId
}