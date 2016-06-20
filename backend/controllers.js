var request = require('request');
var parser = require('body-parser');

var models = require('./models')
var utils = require('./utilities');

var controllers;
module.exports = controllers = {
  //USER BACKEND CONTROLLERS
  // login with existing user
  login: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      models.login.post(username, password, function(isUser){
        if (isUser) {
          utils.createSession(request, response, isUser, function (token, name) {
            console.log("+++ 18 controllers.js token: ", token)
           response.status(200).send( {
             'username': name,
             'beeroclock': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
          response.sendStatus(400);
        };
      })
    }
  },
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
           response.status(200).send( {
             'username': name,
             'beeroclock': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
            response.sendStatus(400);
          };
        })
      } else {
        response.sendStatus(400);
      };
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
      var username = request.params.friendName;
      models.friends.get(username, function (foundFriend) {
        response.status(200).json({ foundFriend });
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
          response.status(400).json(friendsList)
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
          response.status(200).json({friendshipRequestCreated})
        } else{
          response.sendStatus(404);
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
          response.status(200).json(result)
        } else{
          response.sendStatus(404);
        };
      })
    }
  },
  events: {
    post: function (request, response) {
    console.log("+++ 116 controllers.js Here")
    var newEventObj = {};
    newEventObj.userId = 7; // NEED TO CHANGE TO request.session.user.id when auth is working
    newEventObj.ownerLat = request.body.ownerLat;
    newEventObj.ownerLong = request.body.ownerLong;
    models.events.post(newEventObj, function(result) {
        if(result){
          response.status(200).json(result)
        } else{
          response.status(400)
        };
      })
    },
    get: function (request, response) {
      var userId = 1; // NEED TO CHANGE TO request.session.user.id when auth is working
      models.events.get(userId, function (result) {
        if(result){
          response.status(200).json(result)
        } else{
          response.status(400)
        };
      })
    }
  }
}












