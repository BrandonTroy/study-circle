const express = require('express');
const userDao = require('../dao/userDao');
const { TokenMiddleware, generateToken, removeToken } = require('../utils/tokenMiddleware');

// Handle subroutes
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.login && req.body.password) {
    userDao.getUserByCredentials(req.body.login, req.body.password).then(user => {
      generateToken(req, res, user);
      res.json({ user: user });
    }).catch(err => {
      res.status(400).json({error: err});
    });
  }
  else {
    res.status(401).json({error: 'Not authenticated'});
  }
});


// Signup endpoint
router.post('/signup', (req, res) => {
  if (req.body.first_name && req.body.last_name && req.body.username && req.body.password) {
    userDao.createAuthenticatedUser(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password).then(user => {
      generateToken(req, res, user);
      res.json({ user: user });
    }).catch(err => {
      res.status(400).json({ error: err });
    });
  } else {
    res.status(401).json({error: 'Not authenticated'});
  }
});


// Logout endpoint
router.post('/logout', (req, res) => {
  removeToken(req, res);
  res.json({success: true});
});


// Gets current user from token
router.get('/current', TokenMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
