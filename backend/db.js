// Requirements
var Sequelize = require('sequelize');
var url = require('url');
var createTest = require("./test.js").createTest;
var apiKeys = require('./apiKeys')

var dbName = "beer";
var dbUser = "root";
var dbPass = apiKeys.mysqlPass;

var sequelize = null;

if(process.env.CLEARDB_DATABASE_URL){
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
} else {
  // the application is executed on the local machine ... use mysql
  sequelize = new Sequelize(dbName, dbUser, dbPass);
}

// Sequelize Models
// based on SQL schema

// User Schema
var User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING
}, {
  timestamps: true
});

// Event Schema
var Event = sequelize.define('Event', {
  userId: Sequelize.INTEGER,
  ownerName: Sequelize.STRING,
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  ownerLat: {
    type: Sequelize.FLOAT(53),
    validate: {
      min: -90.0,
      max: 90.0
    },
    defaultValue: null
  },
  ownerLong: {
    type: Sequelize.FLOAT(53),
    validate: {
      min: -180.0,
      max: 180.0
    },
    defaultValue: null
  },
  centerLat: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -90.0,
      max: 90.0
    },
    defaultValue: null
  },
  centerLong: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -180.0,
      max: 180.0
    },
    defaultValue: null
  },
  expirationDate: {
    type: Sequelize.DATE
  },
  locationLat: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -90.0,
      max: 90.0
    },
    defaultValue: null
  },
  locationLong: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -180.0,
      max: 180.0
    },
    defaultValue: null
  },
  locationName: Sequelize.STRING,
  locationAddress1: Sequelize.STRING,
  locationAddress2: Sequelize.STRING,
  locationPhone: Sequelize.STRING,
  locationRating: Sequelize.INTEGER,
  userNote: Sequelize.STRING
}, {
  timestamps: true,
  paranoid: true
});

// Attendee Schema
var Attendee = sequelize.define('Attendee', {
  eventId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  username: Sequelize.STRING,
  attendeeLat: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -90.0,
      max: 90.0
    },
    defaultValue: null
  },
  attendeeLong: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -180.0,
      max: 180.0
    }
  }
}, {
  timestamps: true,
  paranoid: true
});


// Friend Schema
var Friend = sequelize.define('Friend', {
  inviteId: Sequelize.INTEGER,
  inviteeId: Sequelize.INTEGER,
  accepted: {
    type: Sequelize.BOOLEAN,
    defaultValue: null
  },
  blocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
});

//User has many events, events have one user
// User.hasMany(Event, {
//   foreignKey: 'userId'
// })

// Event.belongsTo(User, {
//   foreignKey: 'userId'
// });

// //Event has many attendees, attendees, have many events
// Event.hasMany(Attendee, {
//   foreignKey: 'eventId'
// });

// Attendee.hasMany(Event, {
//   foreignKey: 'userId'
// });

// Attendee.belongsTo(User, {
//   foreignKey: 'id'
// })

// User.belongsToMany(Attendee, {
//   through: {
//     model: Attendee
//   },
//   foreignKey: 'id',
//   defaultValue: null
// });


// Create the tables in the database
User.sync().then(function(){
  Event.sync().then(function() {
    Friend.sync().then(function () {
      Attendee.sync().then(function () {
        // Create Test data
        createTest();
      })
    })
  })
})

// Make all Models available in Router
exports.User = User;
exports.Event = Event;
exports.Attendee = Attendee;
exports.Friend = Friend;
// exports.EventAttendee = EventAttendee;
