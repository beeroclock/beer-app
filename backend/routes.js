// Requirements
var router = require('express').Router();
var request = require('request');
var parser = require('body-parser');

var controllers = require('./controllers');

// Authentication and Calculation utilities
var utils = require('./utilities');

// Open app if logged in, middleware will reroute if not
router.get('/', utils.checkUser, function(request, response) {
  response.redirect('/app');
});

// Reroute to app
router.get('/app', utils.checkUser, function(request, response) {
  console.log("Redirecting to Main")
  response.status(202)
});

// User login API to create session
router.post('/login', function(request, response) {
  controllers.login.post(request, response);
});

// Create a new User
router.post('/signup', function(request, response) {
  controllers.signup.post(request, response);
})

// Change password
router.patch('/changePassword', function(request, response) {
  controllers.changePassword.patch(request, response);
})

// User logout
router.get('/logout', function(request, response) {
  controllers.logout.get(request, response)
});

//Get all users on the db
router.get('/allUsers/', utils.checkUser, function(request, response) {
  controllers.allUsers.get(request, response)
});

// Search for friend by username
router.get('/friends/:friendName', utils.checkUser, function(request, response) {
  controllers.friends.get(request, response)
});

// Get friends list
router.get('/friends/', utils.checkUser, function(request, response) {
  controllers.friendsList.get(request, response)
});

// Request new friendship
router.post('/friendship', utils.checkUser, function(request, response) {
  controllers.friendship.post(request, response)
})

// Update friendship status
router.put('/friendship', utils.checkUser, function(request, response) {
  controllers.friendship.put(request, response)
})

// Create new event
router.post('/events', utils.checkUser, function(request, response) {
  controllers.events.post(request, response)
})

//get Active Friend's Events
router.get('/events', utils.checkUser, function(request, response) {
  controllers.events.get(request, response)
})

//Accept Event
router.post('/acceptEvent/:id', utils.checkUser, function(request, response) {
  controllers.acceptEvent.post(request, response)
})

//Get single active event
router.get('/events/:id', utils.checkUser, function(request, response) {
  controllers.activeEvent.get(request, response)
})

//Get logged in user's active event
router.get('/getMyEvent', utils.checkUser, function(request, response) {
  controllers.getMyEvent.get(request, response)
})

router.put('/lockEvent/:id', utils.checkUser, function (request, response) {
  controllers.lockEvent.put(request, response)
})

// Search Yelp // To test if the API is working. Not being used from the front end
router.get('/yelp', function (request, response) {
  controllers.yelp.post(request, response)
});

router.post('/uber', function (request, response) {
  controllers.uber.post(request, response)
});

module.exports = router;
