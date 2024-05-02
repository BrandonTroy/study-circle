const express = require('express');
const cookieParser = require('cookie-parser');
const accountRouter = require('./routes/account');
const circlesRouter = require('./routes/circles');
const chatsRouter = require('./routes/chats');
const usersRouter = require('./routes/users');
const websocketRouter = require('./routes/webSocketRoutes').router;
const { TokenMiddleware } = require('./utils/tokenMiddleware');

// Define the port to run the server on
const PORT = 3000;

// Create an app
const app = express();

// Serve static files
app.use(express.static('static'));

// Parse requests into JSON objects
app.use(express.json());

// Handle cookies
app.use(cookieParser());

// Handle routes
app.use('/account', accountRouter);
app.use(websocketRouter);
app.use(TokenMiddleware);
app.use('/circles', circlesRouter);
app.use('/chats', chatsRouter);
app.use('/users', usersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});