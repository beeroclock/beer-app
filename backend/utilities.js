// Requirements
var session = require('express-session');
var jwt  = require('jwt-simple');
var _ = require('lodash');
var Yelp = require('yelp');
var Uber = require('node-uber');

var apiKeys = require('./apiKeys')


var yelp = new Yelp(apiKeys.yelpKeys)

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

exports.searchUberApi = function (request, response, startLat, startLong, endLat, endLong){
  uber.estimates.price({
    start_latitude: startLat, start_longitude: startLong,
    end_latitude: endLat, end_longitude: endLong
  }, function (err, res) {
    if (err) {
      console.error(err);
      response.sendStatus(500)
    } else {
      response.status(200).send( {
        uberX: res.prices[0],
        uberXL: res.prices[1],
        uberSELECT: res.prices[3],
        uberBLACK: res.prices[4],
        uberSUV: res.prices[5],
        uberLUX: res.prices[6]
      });
    }
  });
}

//---------

// Central Point Math
exports.getSingleCentralPoints = function(ownerPoints, acceptedPoints, num) {
  var d0 = (acceptedPoints[0] - ownerPoints[0]) / (num + 1);
  var d1 = (acceptedPoints[1] - ownerPoints[1]) / (num + 1);
  var points = [];
  for (var i = 1; i <= num; i++) {
    points.push({
      x: ownerPoints[0] + d0 * i,
      y: ownerPoints[1] + d1 * i
    });
  }
  return points;
}
