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
router.get('/events/', utils.checkUser, function(request, response) {
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

router.get('/testRoute/:id', utils.checkUser, function(request, response) {
  controllers.testRoute.get(request, response)
})

router.put('/lockEvent/:id', utils.checkUser, function (request, response) {
  controllers.lockEvent.put(request, response)
})




module.exports = router;
///--------






// Search Yelp
router.post('/yelp', function (request, response) {
  var centerLat = request.body.centerLat;
  var centerLong = request.body.centerLong;
  console.log("Center lat from form: ", centerLat);
  console.log("Center long from form: ",centerLong);
  utils.searchYelpApi(request, response, centerLat, centerLong);
});

// Search Uber
router.post('/uber', function (request, response) {
  var startLat = request.body.startLat;
  var startLong = request.body.startLong;
  var endLat = request.body.endLat;
  var endLong = request.body.endLong;

  console.log("Start lat from form: ", startLat);
  console.log("Start long from form: ", startLong);
  console.log("End lat from form: ", endLat);
  console.log("End long from form: ", endLong);

  utils.searchUberApi(request, response, startLat, startLong, endLat, endLong);
});

