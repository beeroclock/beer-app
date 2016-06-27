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
  console.log("+++ 77 routes.js Sending to App")
  response.status(202).sendFile('/client/app.html');
});

// User login API to create session
router.post('/login', function(request, response) {
  controllers.login.post(request, response);
});

// Serve the authentication SPA when logged out
router.get('/login', function(request, response) {
  var dirname = __dirname
  dirname = dirname.slice(0, -7)
  response.status(200).sendFile(dirname + '/client/auth.html')
})

// Create a new User
router.post('/signup', function(request, response) {
  controllers.signup.post(request, response);
})

// User logout
router.get('/logout', function(request, response) {
  controllers.logout.get(request, response)
});

// Search for friend by username
router.get('/friends/:friendName', function(request, response) {
  controllers.friends.get(request, response)
});

// Get friends list
router.get('/friends/', function(request, response) {
  controllers.friendsList.get(request, response)
});

// Request new friendship
router.post('/friendship', function(request, response) {
  controllers.friendship.post(request, response)
})

// Update friendship status
router.put('/friendship', function(request, response) {
  controllers.friendship.put(request, response)
})

// Create new event
router.post('/events', function(request, response) {
  controllers.events.post(request, response)
})

//get Friend's Events
router.get('/events/', function(request, response) {
  controllers.events.get(request, response)
})

//Accept Event
router.post('/acceptEvent/:id', function(request, response) {
  controllers.acceptEvent.post(request, response)
})

//Get single active event
router.get('/events/:id', function(request, response) {
  controllers.activeEvent.get(request, response)
})

router.get('/testRoute/:id', function(request, response) {
  controllers.testRoute.get(request, response)
})

router.put('/lockEvent/:id', function (request, response) {
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

