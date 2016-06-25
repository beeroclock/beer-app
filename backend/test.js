var db = require('./db.js');
var _ = require('lodash');
var Promise = require('bluebird');

exports.createTest = function(){
  console.log("+++ 6 test.js -- Creating Test data")
  db.User.find({
    name: "test"
  }).then(function (found) {
    if (!found){
      var users = [
        {
          username: "test1",
          password: "1",
          email: "1@1.com"
        },
        {
          username: "test2",
          password: "2",
          email: "2@1.com"
        },
        {
          username: "test3",
          password: "3",
          email: "3@1.com"
        }
      ];
      var usersCreated = [];
      _.forEach(users, function(user){
        db.User.create(
          user
        );
      });
      Promise.all(usersCreated).then(function(user){
        var events = [
          {
            "userId": 1,
            "ownerName": "test1",
            "ownerLat": 33.3451,
            "ownerLong": -128.1443,
            "expirationDate": "2017-06-25 16:59:01"
          },
          {
            "userId": 2,
            "ownerName": "test2",
            "ownerLat": 23.31,
            "ownerLong": -128.123,
            "expirationDate": "2017-06-25 16:59:01"
          }
        ];
        var eventsCreated = [];
        _.forEach(events, function(event){
          db.Event.create(
            event
          );
        });
        Promise.all(eventsCreated).then(function(event){
          var friends = [
            {
             "inviteId": 2,
             "inviteeId": 1,
             "accepted": true
            },
            {
             "inviteId": 3,
             "inviteeId": 1,
             "accepted": true

            },
            {
             "inviteId": 4,
             "inviteeId": 1
            },
            {
             "inviteId": 1,
             "inviteeId": 5,
             "accepted": true
            },
            {
             "inviteId": 6,
             "inviteeId": 1
            },
            {
             "inviteId": 1,
             "inviteeId": 7,
             "accepted": false
            },
            {
             "inviteId": 1,
             "inviteeId": 8,
             "accepted": false
            },
            {
             "inviteId": 9,
             "inviteeId": 1
            },
            {
             "inviteId": 1,
             "inviteeId": 10,
             "accepted": true
            },
            {
             "inviteId": 2,
             "inviteeId": 3,
             "accepted": false
            },
            {
             "inviteId": 2,
             "inviteeId": 4
            },
            {
             "inviteId": 5,
             "inviteeId": 2,
             "accepted": true
            }
          ];
          var queried = [];
          _.forEach(friends, function(friend){
            db.Friend.create(
              friend
            );
          });
          Promise.all(queried).then(function(createdfriends){
              var accepts = [
                {
                  "eventId": 1,
                  "userId": 2,
                  "attendeeLat": 34.34,
                  "attendeeLong": -118.132
                },
                {
                  "eventId": 1,
                  "userId": 5,
                  "attendeeLat": 33.33,
                  "attendeeLong": -117.1
                },
                {
                  "eventId": 2,
                  "userId": 5,
                  "attendeeLat": 32.32,
                  "attendeeLong": -117.1
                }

              ];
              var acceptedList = [];
              _.forEach(accepts, function (accept) {
                db.Attendee.create(
                  accept
                )
              })
              Promise.all(acceptedList).then(function(acceptees) {
                  console.log("+++ 96 test.js -- Test Data created")
              })
            });
        });
      });
    } else{
      console.log("+++ 84 test.js - Test data already created")
    };
  })
};
