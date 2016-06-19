var db = require('./db.js');
var Promise = require('bluebird');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');

// Sequelize Extras to enable raw SQL
var sequelize = require('./db').Sequelize;
var seq = require('./db').seq;

// Authentication and Calculation utilities
var util = require('./utilities');

module.exports = {
  login: {
    post: function (username, password, callback) {
      db.User.find({
        where: {
          username: username
        }
      })
      .then(function(found) {
        if (found) {
          bcrypt.compare(password, found.password, function(err, res) {
              callback(found)
          });
        } else {
          callback(false)
        };
      })
    }
  },
  signup: {
    post: function (username, password, email, callback) {
      db.User.findOrCreate({
        where: {
          $or:[{username: username}, {email: email}]
        }
      })
      .spread(function (found, create) {
        if (create) {
          bcrypt.hash(password, null, null, function(err, hash) {
            found.username = username;
            found.email = email;
            found.password = hash;
            found.save();
            callback(found);
          })
        }else{
          callback(false);
        }
      })
    }
  }
}

// exports.signup = function (username, password, email, request, response) {
//   db.User.findOrCreate({
//     where: {
//       username: username,
//       password: password,
//       email: email
//     }
//   })
//   .spread(function(result, created) {
//     if (created === true) {
//       util.createSession(request, response, result.dataValues.id);
//     }
//   })
// }
// //login
// exports.login = function (username, password, request, response) {

// }
// //logout
// exports.logout = function (request, response) {
//   request.session.destroy(function() {
//     console.log("Logged out")
//     response.redirect('/login');
//   });
// }

// //FRIENDS BACKEND ROUTES
// exports.findFriend = function (friendName) {
//   db.User.find({
//     where: {
//       username: friendName
//     }
//   })
//   .then(function(foundFriend) {
//     return foundFriend
//   })
// }

