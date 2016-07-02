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
             'beeroclock': token,
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
  // logout user
  logout: {
    get: function (request, response) {
      request.session.destroy(function() {
        console.log("Logged out")
        response.redirect('/login');
      });
    }
  },
  // find user by username
  friends: {
    get: function (request, response) {
      var myUserId = 1; // NEED TO CHANGE TO request.session.user.id when auth is working
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
      var userId = 1 // NEED TO CHANGE TO request.session.user.id when auth is working
      models.friendsList.get(userId, function (friendsList) {
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
      var friendId = request.body.friendId;
      var userId = request.body.userId; // NEED TO CHANGE TO request.session.user.id when auth is working
      models.friendship.post(userId, friendId, function (friendshipRequestCreated) {
        if (friendshipRequestCreated) {
          response.status(201).json(friendshipRequestCreated)
        } else{
          response.sendStatus(302);
        };
      })
    },
    put: function(request, response) {
      var inviteId = request.body.userId; // NEED TO CHANGE TO request.session.user.id when auth is working
      var inviteeId = request.body.friendId;
      var userResponse = request.body.userResponse;
      models.friendship.put(inviteId, inviteeId, userResponse, function (friendshipUpdated) {
        if (friendshipUpdated) {
          var result = friendshipUpdated.dataValues
          response.status(202).json(result)
        } else{
          response.sendStatus(409);
        };
      })
    }
  },
  // (POST) Create a new event, (GET) get Friend's events
  events: {
    post: function (request, response) {
    var newEventObj = {};
    newEventObj.userId = request.body.userId; // NEED TO CHANGE TO request.session.user.id when auth is working
    newEventObj.ownerLat = request.body.ownerLat;
    newEventObj.ownerLong = request.body.ownerLong;
    models.events.post(newEventObj, function(result) {
        if(result){
          response.status(201).json(result)
        } else{
          response.sendStatus(409);
        };
      })
    },
    get: function (request, response) {
      var userId = 1; // NEED TO CHANGE TO request.session.user.id when auth is working
      models.friendsList.get(userId, function (friendsList) {
        if(friendsList){
          models.events.get(friendsList, function (foundEvent) {
            response.status(200).json(foundEvent)
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
      var eventId = request.params.id;
      var userId = request.body.userId; // NEED TO CHANGE TO request.session.user.id when auth is working
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
              models.updateEventLocation.put(eventId, centerPoints, function (eventUpdated) {
                response.status(200).json(eventUpdated)
              })
            })
          })
        } else if (!isActive){
          console.log("+++ 172 controllers.js -- Event is Inactive/Locked")
          response.status(200).json(event)
        }else{
          response.sendStatus(409);
        };
      })
    }
  },
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
  lockEvent: {
    put: function (request, response) {
      var eventId = request.params.id;
      models.lockEvent.put(eventId, function(result) {
        response.status(200).json(result)
      })
    }
  }
}












