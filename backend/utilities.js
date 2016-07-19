// Requirements
var session = require('express-session');
var jwt  = require('jwt-simple');
var _ = require('lodash');
var Yelp = require('yelp');
var Uber = require('node-uber');

var apiKeys = require('./apiKeys')


var yelp = new Yelp(apiKeys.yelpKeys)
var uber = new Uber(apiKeys.uberKeys)

// Auth
var decodeToken = exports.decodeToken = function(request){
  return jwt.decode(request.headers['beeroclock-token'], 'itsberroclocksomewhere');
}

//Create session
exports.createSession = function(request, response, isUser, callback) {
  var token = jwt.encode({
    "userId": isUser.id,
    "username": isUser.name
  },
    'itsberroclocksomewhere');
  callback(token, isUser.username);
}

// Logic checks
var isLoggedIn = function(token) {
  var hash = jwt.decode(token, 'itsberroclocksomewhere');
  return !!hash.userId;
}

// Reroute based on Auth status
exports.checkUser = function(request, response, next) {
  var token = request.headers['beeroclock-token'];
  if (!token || (token === "undefined")){
    response.status(401).send("No token detected")
  } else {
    if (isLoggedIn(token)){
      console.log("+++ 54 utilities.js User is Logged in")
      var hash = jwt.decode(token, 'itsberroclocksomewhere');
      request.token = hash,
      request.userId = hash.userId;
      next()
    } else {
      response.sendStatus(401);
    }
  }
}

exports.searchYelpApi = function (centerLat, centerLong, callback){
  var cLat = centerLat;
  var cLong = centerLong;
  var cll = cLat.toString() + ',' + cLong.toString();
  var closestBar = [];

  yelp.search({ term: 'bar', ll: cll, limit: 1, sort: 1 })
  .then(function (data) {
    var address = data.businesses[0].location.display_address;
    if(address.length === 3){
      address.splice(1,1);
    }
    callback(data)
  })
  .catch(function (err) {
    console.error(err);
    callback(err)
  });
}

exports.getUberData = function (userLat, userLong, locationLat, locationLong, callback){
  uber.estimates.getPriceForRoute(userLat, userLong, locationLat, locationLong, null,
    function (err, res) {
      if (err) {
        callback(err)
      } else {
        callback(res)
      }
    });
}
