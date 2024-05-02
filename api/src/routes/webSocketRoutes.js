const express = require('express');
const websocketRouter = express.Router();

websocketRouter.use(express.json());

/********************\
* PUSH NOTIFICATIONS *
\********************/


const webpush = require('web-push');

const vapidKeys = {
  publicKey: 'BJSOOYHFq8BCnFQFacpRZGS6w-B4NnAycFam_psiwcock4jwUBN8Vviu3_xxxjexcpqIA9-_OTe-mymD6uXfuPg',
  privateKey: '4SposadV9zOTzMmrRWUW7Jld_-rjCulpcZoGQ834_xA'
};

//Associate these keys to the webpush library
webpush.setVapidDetails('mailto:xce@ncsu.edu', vapidKeys.publicKey, vapidKeys.privateKey);

//Store push subscriptions in memory as an object where the key is the name of the user
let pushSubscriptions = {};

// Sends a push notification to a user
function sendPush(id, title, message) {
  const subscription = pushSubscriptions[parseInt(id)];
  if (!subscription) {
    return;
  }
  webpush.sendNotification(subscription, JSON.stringify({
    title: title,
    body: message
  }));
}

// This route is called when a user subscribes to push notifications
websocketRouter.post('/subscribe', (req, res) => {
  pushSubscriptions[parseInt(req.body.id)] = req.body.subscription;
  res.status(201).send("Successfully subscribed to push notifications");
});


module.exports = {
  router: websocketRouter,
  sendPush: sendPush
};