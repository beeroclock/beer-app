var request = require('request');
var parser = require('body-parser');

var models = require('./models')
var utils = require('./utilities');

var controllers;
module.exports = controllers = {
  //USER BACKEND CONTROLLERS
  //login
  login: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      models.login.post(username, password, function(isUser){
        if(isUser){
          utils.createSession(request, response, isUser);
        }else{
          response.sendStatus(400);
        };
      })
    }
  },
  signup: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      var email = request.body.email;
      if (username !== null || password !== null || email !== null) {
        models.signup.post(username, password, email, function(found){
          if(found){
            response.status(200).json({found})
          }else{
            response.sendStatus(400);
          };
        })
      } else {
        response.sendStatus(400);
      };
    }
  },
  logout: {
    get: function (request, response) {
      request.session.destroy(function() {
        console.log("Logged out")
        response.redirect('/login');
      });
    }
  },
  friends: {
    get: function (request, response) {
      var username = request.params.friendName;
      models.friends.get(username, function (response) {
        response.status(200).json({ response });
      })
    }
  },
  friendsList:{
    get: function (request, response) {
      console.log("+++ 60 controllers.js request.session.user: ", request.session.user)
      var userId = request.session.user.id;
      console.log("+++ 61 controllers.js userId: ", userId)
      models.friendsList.get(userId, function (friendsList) {
        response.status(200).json(friendsList)
      })
    }
  },
  friendship: {
    post: function(request, response) {
      console.log("+++ 69 controllers.js request.session.user: ", request.session.user)
      var friendId = request.body.friendId;
      var userId = request.body.userId;
      models.friendship.post(userId, friendId, function (friendshipRequestCreated) {
        if (friendshipRequestCreated) {
          response.status(200).json({friendshipRequestCreated})
        } else{
          response.sendStatus(404);
        };
      })
    },
    put: function(request, response) {
      console.log("+++ 71 controllers.js patch")
      var inviteId = request.body.userId;
      var inviteeId = request.body.friendId;
      var userResponse = request.body.userResponse;
      models.friendship.put(inviteId, inviteeId, userResponse, function (friendshipUpdated) {
        if (friendshipUpdated) {
          response.status(200).json(friendshipUpdated.dataValues)
        } else{
          response.sendStatus(404);
        };
      })
    }
  }
}


