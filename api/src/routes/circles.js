const express = require('express');
const circleDao = require('../dao/circleDao');
const membershipDao = require('../dao/membershipDao');
const chatDao = require('../dao/chatDao');
const eventsRouter = require('./events');

// Handle subroutes
const circlesRouter = express.Router();
circlesRouter.use('/:circleId/events', eventsRouter);

// Endpoint to get the logged in user's circles
circlesRouter.get('/', (req, res) => {
  membershipDao.getCirclesByUserId(req.user.id).then((circles) => {
    res.json(circles);
  });
});

circlesRouter.get('/:circleId', (req, res) => {
  circleDao.getCircleByCircleId(req.params.circleId).then(circle => {
    res.json(circle);
  });
});

circlesRouter.get('/:circleId/members', (req, res) => {
  membershipDao.getMembersByCircleId(req.params.circleId).then(members => {
    res.json(members);
  });
});

// Endpoint to create a circle
circlesRouter.post('/', (req, res) => {
  chatDao.createChat().then(chatId => {
    circleDao.createCircle(req.body.name, req.body.description, req.body.owner, req.body.public, req.body.course, chatId).then(id => {
      membershipDao.addMembership(req.body.owner, id);
      res.send("Circle created successfully");
    });
  });
});


module.exports = circlesRouter;
