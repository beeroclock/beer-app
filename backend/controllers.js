var request = require('request');
var parser = require('body-parser');

var models = require('./models')
var util = require('./utilities');

var controllers;
module.exports = controllers = {
  //USER BACKEND CONTROLLERS
  //login
  login: {
    get: function (request, response) {},
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      models.login.post(username, password, function(isUser){
        if(isUser){
          response.status(200)
        }else{
          response.sendStatus(400);
        };
      })
    }
  },
  signup: {
    get: function (request, response) {},
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      var email = request.body.email;
      if (username !== null || password !== null || email !== null) {
        models.signup.post(username, password, email, function(found){
          console.log("+++ 35 controllers.js here")
          if(found){
            response.sendStatus(200); //NEED TO REDIRECT TO APP
          }else{
            response.sendStatus(400); //to finish
          };
        })
      } else {
        response.sendStatus(400);
      };
    }
  }
}
//   //signup
//   exports.signup = function (username, password, email, request, response) {
//     db.User.findOrCreate({
//       where: {
//         username: username,
//         password: password,
//         email: email
//       }
//     })
//     .spread(function(result, created) {
//       if (created === true) {
//         util.createSession(request, response, result.dataValues.id);
//       }
//     })
//   }
//   //logout
//   exports.logout = function (request, response) {
//     request.session.destroy(function() {
//       console.log("Logged out")
//       response.redirect('/login');
//     });
//   }

//   //FRIENDS BACKEND ROUTES
//   exports.findFriend = function (friendName) {
//     db.User.find({
//       where: {
//         username: friendName
//       }
//     })
//     .then(function(foundFriend) {
//       return foundFriend
//     })
//   }


