// Requirements
var Sequelize = require('sequelize');
var url = require('url');
var createTest = require("./test.js").createTest;

var dbName = "beer";
var dbUser = "root";
var dbPass = "";

var sequelize = null;

// Heroku-ClearDB Code
// if (process.env.CLEARDB_DATABASE_URL) {
//   // the application is executed on Heroku ... use the postgres database
//   var dbUrl = url.parse(process.env.CLEARDB_DATABASE_URL);
//   sequelize = new Sequelize(dbUrl.pathname.slice(1), dbUrl.auth.split(":")[0],  dbUrl.auth.split(":")[1], {
//     dialect:  'mysql',
//     protocol: 'mysql',
//     host:     dbUrl.hostname,
//     logging:  true
//   })


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
  classMethods: {
    associate: function(models) {
      User.belongsToMany(models.Attendee, {
        as:'attendees',
        through: 'UserAttendees'
      });
    }
  }
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
  }
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
  classMethods: {
    associate: function(models) {
      Attendee.belongsToMany(models.User, {
        as:'users',
        through: 'UserAttendees'
      });
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
  }
});

//User has many events, events have one user
User.hasMany(Event, {
  foreignKey: 'userId'
})

Event.belongsTo(User, {
  foreignKey: 'userId'
});

//Event has many attendees, attendees, have many events
Event.hasMany(Attendee, {
  foreignKey: 'eventId'
});

Attendee.hasMany(Event, {
  foreignKey: 'userId'
});

Attendee.belongsTo(User, {
  foreignKey: 'id'
})

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
