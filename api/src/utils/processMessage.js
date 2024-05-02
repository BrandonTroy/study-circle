// Function to process messages
function processMessage(message) {
  if (!message) return {};
  message.id = message.message_id;
  message.sender = message.sender_id;
  delete message.message_id;
  delete message.chat_id;
  delete message.sender_id;
  return message;
}

module.exports = processMessage