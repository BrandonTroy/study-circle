
const express = require('express');
const chatDao = require('../dao/chatDao');

// Handle subroutes
const chatsRouter = express.Router();

// Endpoint to get specific chat by chat ID
chatsRouter.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = await getChatByChatId(chatId);
    res.json(message);
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get all messages by chat ID
chatsRouter.get('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await chatDao.getMessagesByChatId(chatId);
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add a new chat
chatsRouter.post('/', async (req, res) => {
  try {
    const chatId = await chatDao.createChat();
    res.json({ id: chatId });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to send a message to a chat by chat ID
chatsRouter.post('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const sender = req.body.sender;
    const content = req.body.content;
    await chatDao.sendMessage(chatId, sender, content);
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = chatsRouter;
