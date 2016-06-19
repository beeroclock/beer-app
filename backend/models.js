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
  },
  friends: {
    get: function (username, callback) {
      var friendObj = {}
      db.User.find({
        where: {
          username: username
        }
      })
      .then(function (foundFriend) {
        friendObj.id = foundFriend.id
        friendObj.username = foundFriend.username
        db.Friend.find({
          where: {
            $or:[{inviteId: foundFriend.dataValues.id}, {inviteeId: foundFriend.dataValues.id}]
          }
        })
        .then(function (foundFriendship) {
          friendObj.foundFriendship = foundFriendship;
          callback(friendObj);
        })
      })
    }
  },
  friendsList: {
    get: function (userId, callback) {
      db.Friend.findAll({
        where: {
          $or: [
            {
              inviteeId: userId,
              accepted: true
            },
            {
              inviteId: userId,
              accepted: true
            }
          ]
        }
      })
      .then(function (friendsList) {
        if(friendsList && friendsList.length > 0) {
              var friendIds = friendsList.map(function(friendConn){
                return {
                  id: friendConn.id
                }
              });
              db.User.findAll({
                where: {
                  $or: friendIds
                }
              }).then(function(friends){
                var friends = friends.map(function(friend){
                  return {id: friend.id, username: friend.username};
                });
                callback(friends);
              });
            } else {
              callback(false);

            }
      })
    }
  },
  friendship: {
    post: function (userId, friendId, callback) {
        db.Friend.findOne({
          where: {
            $or: [
              {
                inviteId: friendId,
                inviteeId: userId
              },
              {
                inviteeId: friendId,
                inviteId: userId
              }
            ]
          }
        })
        .then(function(result) {
          if(result === null){
            db.Friend.create({
              inviteId: userId,
              inviteeId: friendId
            })
            .then(function(friendshipRequestCreated) {
              callback(friendshipRequestCreated)
            })
          }else{
            callback(false)
          };
        })
    },
    put: function (inviteId, inviteeId, userResponse, callback) {
      db.Friend.find({
        where: {
          $and:[{inviteId: inviteId}, {inviteeId: inviteeId}]
        }
      })
      .then(function(result) {
        if(result){
          result.update({
            accepted: userResponse
          })
          .then(function (friendshipUpdated) {
            callback(friendshipUpdated)
          })
        }else{
          callback(false)
        };
      })
    }
  }
}

