var request = require('request');
var parser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');

// Database Requirements
var mysql = require('mysql');

// Models
var db = require('./db'); // Available: .User, .Event, .Friend

// Sequelize Extras to enable raw SQL
var sequelize = require('./db').Sequelize;
var seq = require('./db').seq;

// Authentication and Calculation utilities
var util = require('./utilities');

exports.signup = function (username, password, email, request, response) {
  db.User.findOrCreate({
    where: {
      username: username,
      password: password,
      email: email
    }
  })
  .spread(function(result, created) {
    if (created === true) {
      util.createSession(request, response, result.dataValues.id);
    }
  })
}

exports.login = function (username, password, request, response) {
  db.User.find({
    where: {
      username: username,
      password: password
    }
  })
  .then(function(result) {
    if (result) {
      util.createSession(request, response, result.id);
    } else {
      response.sendStatus(401);
    };
  })
}


exports.logout = function (request, response) {
  request.session.destroy(function() {
    console.log("Logged out")
    response.redirect('/login');
  });
}
