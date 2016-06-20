var db = require('./db.js');
var Promise = require('bluebird');
var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');

// Sequelize Extras to enable raw SQL
var sequelize = require('./db').Sequelize;
var seq = require('./db').seq;

// Authentication and Calculation utilities
var util = require('./utilities');

module.exports = {
  // login with existing user
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
  // signup new user
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
  // find user by username
  friends: {
    get: function (username, callback) {
      var friendObj = {}
      db.User.find({
        where: {
          username: username
        }
      })
      .then(function (foundFriend) {
        if (foundFriend) {
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
        }else{
          callback(foundFriend)
        };
      })
    }
  },
  // get user's friends list
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
              var friendIds = []
              var inviteeIds = friendsList.map(function(friendConn){
                return {
                  inviteeId: friendConn.dataValues.inviteeId
                }
              });
              inviteeIds = _(inviteeIds).forEach(function(inviteeId) {
                _.forEach(inviteeId, function(value) {
                  friendIds.push(value)
                })
              })
              var inviteIds = friendsList.map(function(friendConn){
                return {
                  inviteId: friendConn.dataValues.inviteId
                }
              });
              inviteIds = _(inviteIds).forEach(function(inviteId) {
                _.forEach(inviteId, function(value) {
                  friendIds.push(value)
                })
              })
              // friendIds = _.uniq(friendIds)
              friendIds = _.pull(friendIds, userId)
              console.log("+++ 126 models.js friendIds: ", friendIds)
              db.User.findAll({
                where: {
                  id: friendIds
                }
              })
              .then(function(friends){
                var friends = friends.map(function(friend){
                  return {id: friend.id, username: friend.username};
                });
                friends = _.orderBy(friends, ['username'],['asc'])
                callback(friends);
              });
        } else {
          callback(false);

        }
      })
    }
  },
  // (POST) request a new friendship, (PUT) Update friendship status.
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
  },
  events: {
    // (POST) Create a new event, (GET) get Friend's events
    post: function (newEventObj, callback) {
      var currentTime = new Date();
      db.Event.findAll({
        where: {
          userId: newEventObj.userId,
          expirationDate: {
            $gt: currentTime
          }
        }
      })
      .then(function (eventFound) {
        if (!eventFound[0]) {
          currentTime.setHours(currentTime.getHours() + 12);
          db.User.find({
            where: {
              id: newEventObj.userId
            }
          })
          .then(function (user) {
            db.Event.create({
              userId: newEventObj.userId,
              ownerName: user.dataValues.username,
              ownerLat: newEventObj.ownerLat,
              ownerLong: newEventObj.ownerLong,
              expirationDate: currentTime
            })
            .then(function(eventCreated) {
              if (eventCreated) {
                callback(eventCreated)
              } else{
                callback(false)
              };
            })
          })
        }else{
          callback(false)
        }
      })
    },
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
        if(!!friendsList && friendsList.length !== 0) {
          var friendsNames = friendsList.map(function(usersFriends) {
            return {
              UserId: {
                $eq: usersFriends.id
              }
            };
          });
          console.log("+++ 223 models.js friendsNames: ", friendsNames)
          var currentTime = new Date();
          db.Event.findAll({
            where: {
              $or: friendsNames,
              expirationDate: {
                $gt: currentTime
              }
            }
          })
          .then(function(eventsFound){
            if (eventsFound) {
              callback(eventsFound)
            } else{
              callback(false)
            };
          })
        } else{
          callback(false)
        };
      })
    }
  },
  acceptEvent: {
    post: function (eventId, userId, attendeeLat, attendeeLong, callback) {
      db.Event.find({
        id: eventId
      })
      .then(function (eventFound) {
        if (!eventFound[0]) {
          db.Attendee.findAll({
              eventId: eventId
          })
          .then(function (eventAttendees) {
            if (eventAttendees) {
              console.log("+++ 271 models.js eventAttendees: ", eventAttendees)
              callback(true)
            }else{
              callback(false)
            };
          })
        }else{
          callback(false)
        };
      })
    }
  }
}


          // db.Attendee.create({
          //   eventId: eventId,
          //   userId: userId,
          //   attendeeLat: attendeeLat,
          //   attendeeLong, attendeeLong
          // })
          // .then(function (created) {
          //   if (created) {
          //     callback(created)
          //   } else{
          //     callback(false)
          //   };
          // })










