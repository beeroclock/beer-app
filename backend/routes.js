// Requirements
var router = require('express').Router();
var request = require('request');
var parser = require('body-parser');

var controllers = require('./controllers');

// Database Requirements
var mysql = require('mysql');

// Models
var db = require('./db'); // Available: .User, .Event, .Friend

// Sequelize Extras to enable raw SQL
var sequelize = require('./db').Sequelize;
var seq = require('./db').seq;

// Authentication and Calculation utilities
var utils = require('./utilities');

// Open app if logged in, middleware will reroute if not
router.get('/', utils.checkUser, function(request, response) {
  response.redirect('/app');
});

// Reroute to app
router.get('/app', utils.checkUser, function(request, response) {
  console.log("+++ 77 routes.js Sending to App")
  response.status(202).sendFile('/client/app.html');
});

// User login API to create session
router.post('/login', function(request, response) {
  controllers.login.post(request, response);
});

// Serve the authentication SPA when logged out
router.get('/login', function(request, response) {
  var dirname = __dirname
  dirname = dirname.slice(0, -7)
  response.status(200).sendFile(dirname + '/client/auth.html')
})

// Create a new User
router.post('/signup', function(request, response) {
  controllers.signup.post(request, response);
})

// User logout
router.get('/logout', function(request, response) {
  controllers.logout.get(request, response)
});

// Search for friend
router.get('/friends/:friendName', function(request, response) {
  controllers.friends.get(request, response)
});

// Get friends list
router.get('/friends/', function(request, response) {
  controllers.friendsList.get(request, response)
});

// Request new friendship
router.post('/friendship', function(request, response) {
  controllers.friendship.post(request, response)
})

// Update friendship status
router.put('/friendship', function(request, response) {
  controllers.friendship.put(request, response)
})

// Create new event
router.post('/events', function(request, response) {
  controllers.events.post(request, response)
})

//get Friend's Events
router.get('/events/', function(request, response) {
  controllers.events.get(request, response)
})

//Accept Event
router.post('/acceptEvent/:id', function(request, response) {
  controllers.acceptEvent.post(request, response)
})

///--------



// // Check one event
// router.get('/events/:id', utils.checkUser, function(request, response) {
//   var eventId = request.params.id;
//   seq.query(
//       'SELECT Users.id, Users.username FROM Users where Users.id in (SELECT Friends.FriendId from Friends where Friends.UserId = ?)', {
//         replacements: [request.session.user],
//         type: sequelize.QueryTypes.SELECT
//       })
//     .then(function(friendList) {
//       if (!!friendList && friendList.length !== 0) {
//         var friendIds = friendList.map(function(usersFriends) {
//           return {
//             UserId: {
//               $eq: usersFriends.id
//             }
//           };
//         });
//         friendIds.push({
//           UserId: {
//             $eq: request.session.user
//           }
//         });
//         db.Event.findAll({
//           where: {
//             id: eventId,
//             $or: friendIds
//           }
//         }).then(function(item) {
//           response.status(200).json(item)
//         })
//       } else {
//         response.sendStatus(404);
//       }
//     })
// })


// // Get a list of all events
// router.get('/events', utils.checkUser, function(request, response) {
//   seq.query(
//       'SELECT Users.id, Users.username FROM Users where Users.id in (SELECT Friends.FriendId from Friends where Friends.UserId = ?)', {
//         replacements: [request.session.user],
//         type: sequelize.QueryTypes.SELECT
//       })
//     .then(function(friendList) {
//       if(!!friendList && friendList.length !== 0) {
//         var friendIds = friendList.map(function(usersFriends) {

//           return {
//             UserId: {
//               $eq: usersFriends.id
//             }
//           };
//         });

//         var timelimit = new Date();
//         timelimit.setHours(timelimit.getHours() - 1);

//         db.Event.findAll({
//           where: {
//             accepted: 0,
//             $or: friendIds,
//             createdAt: {
//               $gt: timelimit
//             }
//           }
//         }).then(function(results) {
//           if (results) {
//             // var results = item.map(function(item, index) {
//             //   if(friendList[index]){
//             //     item.dataValues.username = friendList[index].username;
//             //     return item
//             //   }
//             // })
//             response.status(200).json({results})
//           } else {
//             response.sendStatus(404)
//           };
//         });
//       } else {
//         response.sendStatus(404);
//       }
//     });
// });

// // Accept event invite
// router.post('/events/:id', utils.checkUser, function(request, response) {
//   var id = request.params.id;
//   var acceptedId = request.session.user;
//   var acceptedAt = Date.now();
//   var acceptedLat = request.body.acceptedLat;
//   var acceptedLong = request.body.acceptedLong;

//   db.Event.findById(id)
//     .then(function(acceptedEvent) {
//       if (acceptedEvent.accepted !== true) {
//         db.User.find({
//             where: {
//               id: request.session.user
//             }
//           })
//           .then(function(acceptor) {
//             console.log("acceptor: ", acceptor)
//             var lat1 = acceptedEvent.ownerLat;
//             var lon1 = acceptedEvent.ownerLong;
//             var lat2 = acceptedLat;
//             var lon2 = acceptedLong;
//             var ownerPoints = [lat1, lon1]
//             var acceptedPoints = [lat2, lon2]
//             var centralLatLong;
//             centralLatLong = utils.getCentralPoints(ownerPoints,
//               acceptedPoints, 1)
//             acceptedEvent.acceptedName = acceptor.username;
//             acceptedEvent.acceptedId = request.session.user; // TO TEST
//             acceptedEvent.acceptedLat = acceptedLat;
//             acceptedEvent.acceptedLong = acceptedLong;
//             acceptedEvent.acceptedAt = acceptedAt;
//             acceptedEvent.centerLat = centralLatLong[0].x;
//             acceptedEvent.centerLong = centralLatLong[0].y;
//             acceptedEvent.accepted = true;
//             console.log("acceptedEvent: ", JSON.stringify(acceptedEvent,
//               null, "\t"));
//             acceptedEvent.save()
//             console.log("Sweet! We updated that event, Angelina Brolie.")

//             db.User.findById(request.session.user)
//             .then(function (currentUser) {
//               db.Event.findById(currentUser.currentEvent)
//               .then(function (currentEvent) {
//                 currentEvent.update({
//                   accepted: true
//                 })
//               })
//             })

//             response.status(202).json(acceptedEvent)
//             acceptor.update({
//                 currentEvent: acceptedEvent.id
//               })
//               .then(function () {
//                 console.log("currentEvent updated for userid", request.session.user)
//               })
//           })
//       } else {
//         console.log("That event already expired, Brosephalus.")
//         response.status(403)
//       };
//     });
// });

// // Creating new event
// router.post('/events', utils.checkUser, function(request, response) {
//   var UserId = request.session.user;
//   var ownerLat = request.body.ownerLat;
//   var ownerLong = request.body.ownerLong;
//   var eventType = request.body.eventType;
//   var message = request.body.message || null;

//   if (UserId !== null || ownerLat !== null || ownerLong !== null) {

//     var timelimit = new Date();

//     if(Number(eventType) !== Number(2)){
//       timelimit.setHours(timelimit.getHours() - 1);
//     }

//     db.Event.find({
//       where: {
//         UserId: UserId,
//         createdAt: {
//           $gt: timelimit
//         },
//         accepted: false,
//         eventType: 1
//       }
//     }).then(function(result) {
//       if(result === null) {
//         db.Event.create({
//           UserId: UserId,
//           ownerLat: ownerLat,
//           ownerLong: ownerLong,
//           eventType: eventType,
//           message: message
//         }).then(function(result){
//           if (result.$options.isNewRecord === true) {
//             db.User.find({
//               where: {
//                 id: request.session.user
//               }
//             }).then(function(owner) {
//               result.ownerName = owner.username;
//               result.save()
//               console.log('time to turn up, Bro-ntosaurus!')
//               response.status(201).send(result);
//               if (Number(eventType) === Number(1)) {
//                 owner.update({
//                   currentEvent: result.id
//                 })
//                 .then(function () {
//                   console.log("Event recognized as brewski")
//                 })
//               }
//             })
//           } else {
//             console.log("That record already exists")
//             response.sendStatus(202)
//           }
//         });
//       } else {
//         console.log("Event already created, Broham")
//         response.sendStatus(409)
//       }
//     });
//   } else {
//     console.log("Bro, some or all your incoming data is null, bro")
//     response.sendStatus(400)
//   }
// });

// Return current user
router.get('/user', utils.checkUser, function (request, response) {
  db.User.find({
    where: {
      id: request.session.user
    }
  }).then(function(result){
    var user = {
      id: result.id,
      username: result.username,
      currentEvent: result.currentEvent
    }
    response.status(200).send(user);
  });
});

// Search Yelp
router.post('/yelp', function (request, response) {
  var centerLat = request.body.centerLat;
  var centerLong = request.body.centerLong;
  console.log("Center lat from form: ", centerLat);
  console.log("Center long from form: ",centerLong);
  utils.searchYelpApi(request, response, centerLat, centerLong);
});

// Search Uber
router.post('/uber', function (request, response) {
  var startLat = request.body.startLat;
  var startLong = request.body.startLong;
  var endLat = request.body.endLat;
  var endLong = request.body.endLong;

  console.log("Start lat from form: ", startLat);
  console.log("Start long from form: ", startLong);
  console.log("End lat from form: ", endLat);
  console.log("End long from form: ", endLong);

  utils.searchUberApi(request, response, startLat, startLong, endLat, endLong);
});

module.exports = router;
