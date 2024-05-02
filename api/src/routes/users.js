const express = require('express');
const cookieParser = require('cookie-parser');
const connectionsRouter = require('./connections');
const notificationsRouter = require('./notifications');
const enrollmentRouter = require('./enrollment');
const userDao = require('../dao/userDao');
const { TokenMiddleware } = require('../utils/tokenMiddleware');
const membershipDao = require('../dao/membershipDao');
const enrollmentDao = require('../dao/enrollmentDao');
const connectionDao = require('../dao/connectionDao');

// Handle subroutes
const userRouter = express.Router();
userRouter.use(cookieParser());
userRouter.use(express.json());

userRouter.use('/:userId/connections', connectionsRouter);
userRouter.use('/:userId/notifications', notificationsRouter);
userRouter.use('/:userId/enrollment', enrollmentRouter);

// Endpoint to get a user, by user ID
userRouter.get('/:userId', TokenMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const user = await userDao.getUserByUserId(userId);
  res.json(user);
});

// Endpoint to get a user, their friends, and their circles by user ID
userRouter.get('/:userId/profile', TokenMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const user = await userDao.getUserByUserId(userId);
  const circles = await membershipDao.getCirclesByUserId(userId);
  const friendIds = await connectionDao.getConnectedUserIds(userId);
  const friends = [];
  for (let i = 0; i < friendIds.length; i++) {
    const friend = await userDao.getUserByUserId(friendIds[i]);
    friends.push({ ...friend, connected: true});
  }
  const courses = await enrollmentDao.getUserEnrollment(userId);
  res.json({ user: user, circles: circles, friends: friends, courses: courses });
});


module.exports = userRouter;
