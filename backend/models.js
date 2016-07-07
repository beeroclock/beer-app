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
          console.log("+++ 43 models.js Here")
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
      var userObj = {}
      db.User.find({
        where: {
          username: username
        }
      })
      .then(function (foundUser) {
        if (foundUser) {
          userObj.id = foundUser.id
          userObj.username = foundUser.username
          db.Friend.find({
            where: {
              $and:[{inviteId: foundUser.dataValues.id}, {inviteeId: myUserId}]
            }
          })
          .then(function (foundFriendship) {
            if (foundFriendship !== null) {
            userObj.foundFriendship = foundFriendship;
            callback(userObj);
            } else {
              db.Friend.find({
                where: {
                  $and:[{inviteId: myUserId}, {inviteeId: foundUser.dataValues.id}]
                }
              })
              .then(function(orFoundFriendship) {
                userObj.foundFriendship = orFoundFriendship;
                callback(userObj);
              })
            };
          })
        }else{
          callback(false)
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
              friendIds = _.pull(friendIds, userId)
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
      .then(function(foundEvent) {
        callback(foundEvent)
      })
    }
  },
  acceptEvent: {
    post: function (eventId, userId, username, acceptedLat, acceptedLong, callback) {
      db.Event.find({
        id: eventId
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
  updateEventLocation: {
    put: function (eventId, centralPoints, callback) {
      db.Event.find({
        where:{
          id: eventId
        }
      })
      .then(function (event) {
        event.centerLat = centralPoints.centerLat,
        event.centerLong = centralPoints.centerLong
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
  // testRoute: {
  //   get: function (eventId, callback) {
  //     console.log("+++ 339 models.js Here")
  //     db.Attendee.findAll({
  //       include: [{
  //         model: db.User,
  //         where: {
  //           $and: {id: 2}
  //         },
  //         attributes: {exclude: ['password', 'email', 'createdAt', 'udpatedAt']}
  //       }],
  //       // where: {
  //       //   eventId: eventId
  //       // },
  //       // include: [db.User]
  //     })
  //     .then(function(event) {
  //       callback(event)
  //     })
  //   }
  // }
}




