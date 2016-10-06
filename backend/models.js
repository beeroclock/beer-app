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
            if (res) {
              callback(found)
            } else{
              callback(false)
            };
          });
        } else {
          callback(false)
        };
      })
    }
  },
  // change password
  changePassword: {
    patch: function(userId, password, newPassword, callback) {
      db.User.find({
        where: {
          id: userId
        }
      })
      .then(function (found) {
        if (found) {
          bcrypt.compare(password, found.password, function(err, res) {
              if (res) {
                bcrypt.hash(newPassword, null, null, function(err, hash) {
                  found.password = hash;
                  found.save();
                  callback(found)
                })
              } else{
                console.log("+++ 82 models.js Password incryption failed. Most likely user tried to update to current password")
                callback(err)
              };
          })
        } else{
          console.log("+++ 86 models.js User not found")
          callback(false)
        };
      })
    }
  },
  allUsers: {
    get: function(callback) {
      db.User.findAll({
        attributes: {exclude: ['email', 'password', 'createdAt', 'updatedAt']}
      })
      .then(function(result){
        if (result.length) {
          callback(result)
        } else {
          callback(false)
        }
      })
    }
  },
  // find user by username
  friends: {
    get: function (username, myUserId, callback) {
      var foundUserList = [];
      db.User.findAll({
        where: {
          username: {
            $like: '%' + username + '%',
          },
          id: {
            $not: myUserId
          }
        }
      })
      .then(function (foundUser) {
        var totalLength = foundUser.length - 1;
        if (foundUser.length) {
          _.forEach(foundUser, function(user, index){
              var userObj = {}
              userObj.id = user.id
              userObj.username = user.username
              db.Friend.find({
                where: {
                  $or:[{inviteId: user.id, inviteeId: myUserId},{inviteId: myUserId, inviteeId: user.id}]
                }
              })
              .then(function (foundFriendship) {
                if (foundFriendship) {
                  userObj.foundFriendship = foundFriendship.dataValues;
                } else {
                  userObj.foundFriendship = null;
                }
                foundUserList.push(userObj)
                if(totalLength === index){
                  callback(foundUserList)
                }
              })
          })
        } else {
          callback(false)
        };
      })
    }
  },
  // get user's friends list **BEING USED BY (GET) get Friend's events****
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
              db.User.findAll({
                where: {
                  id: friendIds,
                  $not: {
                    id: userId
                  }

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
  // get user's friends list *** To populate friend's List ***
  friendsListAndStatus: {
    get: function (userId, callback) {
      db.Friend.findAll({
        where: {
          $or: [
            {
              inviteeId: userId,
            },
            {
              inviteId: userId,
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
              friendIds =  _.uniqBy(friendIds);
              db.User.findAll({
                where: {
                  id: friendIds
                },
                attributes: {exclude: ['password', 'email', 'createdAt', 'updatedAt']}
              })
              .then(function(friends){

                var list = {};

                _.forEach(friends, function(friend){
                  list[friend.id] = friend.username;
                });

                var finalList = _.map(friendsList, function(friendObj){
                  var individualFriend = {}
                  individualFriend.inviteName = list[friendObj.inviteId];
                  individualFriend.inviteeName = list[friendObj.inviteeId];
                  individualFriend.inviteId = friendObj.inviteId;
                  individualFriend.inviteeId = friendObj.inviteeId;
                  individualFriend.accepted = friendObj.accepted;
                  return individualFriend;
                })
                callback(finalList)
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
          $or:[{inviteId: inviteId, inviteeId: inviteeId},{inviteId: inviteeId, inviteeId: inviteId}]
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
  blockUser: {
    put: function (inviteId, inviteeId, callback) {
      db.Friend.find({
        where: {
          $or:[{inviteId: inviteId, inviteeId: inviteeId},{inviteId: inviteeId, inviteeId: inviteId}]
        }
      })
      .then(function(result) {
        if(result){
          result.update({
            blocked: true
          })
          .then(function (friendshipBlocked) {
            callback(true)
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
                eventCreated.locationName = null;
                eventCreated.locationAddress1 = null;
                eventCreated.locationAddress2 = null;
                eventCreated.locationPhone = null;
                eventCreated.locationRating = null;
                eventCreated.userNote = null;
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
    get: function (friendsList, callback) {
      var friendIds = [];
      _.forEach(friendsList, function (friend) {
        friendIds.push(friend.id)
      })
      var currentTime = new Date();
      db.Event.findAll({
        where: {
          userId: friendIds,
          expirationDate: {
            $gt: currentTime
          }
        }
      })
      .then(function(foundEvents) {
        callback(foundEvents)
      })
    }
  },
  acceptEvent: {
    post: function (eventId, userId, username, acceptedLat, acceptedLong, callback) {
      db.Event.find({
        where:{
          id: eventId
        }
      })
      .then(function(eventFound) {
        db.Attendee.findOrCreate({
          where: {
            eventId: eventId,
            userId: userId
          }
        })
        .spread(function (userAttending, create) {
          if (create) {
            userAttending.eventId = eventId;
            userAttending.userId = userId;
            userAttending.username = username;
            userAttending.attendeeLat = acceptedLat;
            userAttending.attendeeLong = acceptedLong;
            userAttending.save();
            callback(userAttending, eventFound);
          } else{
            callback(userAttending, eventFound)
          };
        })
      })
    }
  },
  eventAttendees: {
    get: function (eventId, callback) {
      db.Attendee.findAll({
          eventId: eventId
      })
      .then(function(attendees) {
        callback(attendees)
      })
    }
  },
  activeEvent: {
    get: function(eventId, callback) {
      eventData = {}
      var currentTime = new Date();
      db.Event.find({
        where: {
          id: eventId,
          expirationDate: {
            $gt: currentTime
          }
        }
      })
      .then(function(event) {
        if (event) {
          eventData.event = event;
          db.Attendee.findAll({
            where: {
              eventId: event.id
            }
          })
          .then(function(attendees) {
            eventData.attendees = attendees;
            callback(eventData)
          })
        } else{
          callback(false)
        };
      })
    }
  },
  getMyEvent: {
    get: function (userId, currentTime, callback) {
      db.Event.find({
        where:{
          userId: userId,
          expirationDate: {
            $gt: currentTime
          }
        }
      })
      .then(function(event) {
        callback(event)
      })
    }
  },
  updateEventLocation: {
    put: function (eventId, yelpData, centerLat, centerLong, callback) {
      db.Event.find({
        where:{
          id: eventId
        }
      })
      .then(function (event) {
        event.centerLat = centerLat,
        event.centerLong =  centerLong,
        event.locationLat = yelpData.businesses[0].location.coordinate.latitude,
        event.locationLong =  yelpData.businesses[0].location.coordinate.longitude,
        event.locationName = yelpData.businesses[0].name,
        event.locationAddress1 = yelpData.businesses[0].location.display_address[0],
        event.locationAddress2 = yelpData.businesses[0].location.display_address[1],
        event.locationPhone = yelpData.businesses[0].display_phone,
        event.locationRating = yelpData.businesses[0].rating
        event.save();
        callback(event)
      })
    }
  },
  lockEvent: {
    put: function (eventId, callback) {
      db.Event.find({
        where:{
          id: eventId
        }
      })
      .then(function (event) {
        event.active = false;
        event.save();
        callback(event)
      })
    }
  }
}




