const express = require('express');
const enrollmentDao = require('../dao/enrollmentDao');

// Handle subroutes
const enrollmentRouter = express.Router({ mergeParams: true });

// TODO: Allow users to be able to enroll from and unenroll from courses, and get all courses

// Endpoint to get all courses
enrollmentRouter.get('/', async (req, res) => {
  const enrollment = await enrollmentDao.getUserEnrollment(req.params.userId);
  res.json(enrollment);
});

// Endpoint to enroll in a course
enrollmentRouter.post('/:code', (req, res) => {
  enrollmentDao.enrollUser(req.params.userId, req.params.code).then(result => {
    console.log("Result of enrollment: ", result);
  });
});

// Endpoint to unenroll from a course
enrollmentRouter.delete('/:code', (req, res) => {
  enrollmentDao.unenrollUser(req.params.userId, req.params.code).then(result => {
    console.log("Result of unenrollment: ", result);
  });
});

module.exports = enrollmentRouter;
