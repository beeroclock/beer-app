var request = require('request');
var parser = require('body-parser');

//Services
var models = require('./models')
var utils = require('./utilities');
// var midpointsLogic = require('./midpointsLogic');
var locationsAverage = require('./locationsAverage');

var controllers;
module.exports = controllers = {
  //USER BACKEND CONTROLLERS
  // signup new user
  signup: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      var email = request.body.email;
      if (username !== null || password !== null || email !== null) {
        models.signup.post(username, password, email, function(isUser){
          if(isUser){
          utils.createSession(request, response, isUser, function (token, name) {
           response.status(201).send({
             'username': name,
             'beeroclock-token': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
            response.sendStatus(406);
          };
        })
      } else {
        response.sendStatus(400);
      };
    }
  },
  // login with existing user
  login: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      models.login.post(username, password, function(isUser){
        if (isUser) {
          utils.createSession(request, response, isUser, function (token, name) {
           response.status(200).send( {
             'username': name,
             'beeroclock-token': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
          response.sendStatus(406);
        };
      })
    }
  },
  // Change password
  changePassword: {
    patch: function (request, response) {
      var userId = request.headers.userid;
      var password = request.body.password;
      var newPassword = request.body.newPassword;
      models.changePassword.patch(userId, password, newPassword, function (result) {
          if (result) {
            response.sendStatus(202)
          } else if (result === null){
            response.status(400).send({
             message: 'Password incryption failed. Most likely user tried to update to current password'
           });
          };
      })
    }
  },
  // logout user
  logout: {
    get: function (request, response) {
      request.headers.userid = null;
      request.headers.token = null;
      if(request.headers.userid === null && request.headers.token === null){
        console.log("Logged out")
        response.sendStatus(200);
      }
    }
  },
  allUsers: {
    get: function(request, response) {
      models.allUsers.get(function(result){
        if (result) {
          response.status(200).json(result)
        } else {
          response.sendStatus(400)
        }
      })
    }
  },
  // find user by username
  friends: {
    get: function (request, response) {
      var myUserId = request.headers.userid;
      var username = request.params.friendName;
      models.friends.get(username, myUserId, function (foundFriend) {
        if(foundFriend){
          response.status(200).json(foundFriend);
        } else{
          response.sendStatus(204);
        };
      })
    }
  },
  // get user's friends list
  friendsList:{
    get: function (request, response) {
      var userId = request.headers.userid;
      models.friendsListAndStatus.get(userId, function (friendsList) {
        if (friendsList) {
          response.status(200).json(friendsList)
        } else{
          response.sendStatus(204)
        };
      })
    }
  },
  //(POST) request a new friendship, (PUT) Update friendship status.
  friendship: {
    post: function(request, response) {
      var userId = request.headers.userid;
      var friendId = request.body.friendId;
      models.friendship.post(userId, friendId, function (friendshipRequestCreated) {
        if (friendshipRequestCreated) {
          response.status(201).json(friendshipRequestCreated)
        } else{
          response.sendStatus(302);
        };
      })
    },
    put: function(request, response) {
      var inviteId = request.headers.userid;
      var inviteeId = request.body.friendId;
      var userResponse = request.body.userResponse;
      models.friendship.put(inviteId, inviteeId, userResponse, function (friendshipUpdated) {
        if (friendshipUpdated) {
          var result = friendshipUpdated.dataValues
          response.status(202).json(result)
        } else{
          response.sendStatus(400);
        };
      })
    }
  },
  // (POST) Create a new event, (GET) get Friend's events
  events: {
    post: function (request, response) {
    var newEventObj = {};
    newEventObj.userId = request.headers.userid;
    newEventObj.ownerLat = request.body.ownerLat;
    newEventObj.ownerLong = request.body.ownerLong;
    models.events.post(newEventObj, function(result) {
        if(result){
          response.status(201).json(result)
        } else{
          response.sendStatus(400);
        };
      })
    },
    get: function (request, response) {
      var userId = request.headers.userid;
      models.friendsList.get(userId, function (friendsList) {
        if(friendsList){
          models.events.get(friendsList, function (foundEvents) {
            response.status(200).json(foundEvents)
          })
        } else{
          response.sendStatus(204);
        };
      })
    }
  },
  // Accept an event
  acceptEvent: {
    post: function (request, response) {
      var userId = request.headers.userid;
      var eventId = request.params.id;
      var username = request.body.username
      var acceptedLat = request.body.acceptedLat;
      var acceptedLong = request.body.acceptedLong;
      models.acceptEvent.post(eventId, userId, username, acceptedLat, acceptedLong, function (userAttending, event) {
        var isActive = event.dataValues.active
        if(userAttending && isActive){
          models.activeEvent.get(eventId, function (attendees) {
            var attendeesList = attendees.attendees;
            var eventOwnerLat = event.dataValues.ownerLat;
            var eventOwnerLong = event.dataValues.ownerLong;
            locationsAverage.getCentralPoints(attendeesList, eventOwnerLat, eventOwnerLong, function (centerPoints) {
              utils.searchYelpApi(centerPoints.centerLat, centerPoints.centerLong, function (yelpData) {
                models.updateEventLocation.put(eventId, yelpData, centerPoints.centerLat, centerPoints.centerLong, function (eventUpdated) {
                  response.status(200).json(eventUpdated)
                })
              })
            })
          })
        } else if (!isActive){
          response.status(200).json(event)
        }else{
          response.sendStatus(400);
        };
      })
    }
  },
  //get active event with EventId
  activeEvent: {
    get: function(request, response) {
      var eventId = request.params.id;
      models.activeEvent.get(eventId, function (result) {
        if(result){
          response.status(200).json(result)
        } else{
          response.sendStatus(204);
        };
      })
    }
  },
  //get active event with userId
  getMyEvent: {
    get: function(request, response) {
      var userId = request.headers.userid;
      var currentTime = new Date();
      models.getMyEvent.get(userId, currentTime, function (result) {
        response.status(200).json(result)
      })
    }
  },
  //lock my active event
  lockEvent: {
    put: function (request, response) {
      var eventId = request.params.id;
      models.lockEvent.put(eventId, function(result) {
        response.status(200).json(result)
      })
    }
  },
  yelp: {
    post: function (request, response){
      var centerLat = request.body.centerLat;
      var centerLong = request.body.centerLong;
      utils.searchYelpApi(request, response, centerLat, centerLong);
    }
  },
  uber: {
    post: function (request, response){
      var userLat = request.body.userLat;
      var userLong = request.body.userLong;
      var locationLat = request.body.locationLat;
      var locationLong = request.body.locationLong;
      console.log("+++ 255 controllers.js userLat, userLong, locationLat, locationLong: ", userLat, userLong, locationLat, locationLong)
      utils.getUberData(userLat, userLong, locationLat, locationLong, function (uberData) {
        response.status(200).json(uberData)
      });
    }
  }
}












