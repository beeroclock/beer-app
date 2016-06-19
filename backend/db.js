// Requirements
var Sequelize = require('sequelize');
var url = require('url');

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
// } else if(process.env.DATABASE_URL){
//   sequelize = new Sequelize(process.env.DATABASE_URL);
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ownerName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ownerLat: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
    validate: {
      min: -90.0,
      max: 90.0
    },
    defaultValue: null
  },
  ownerLong: {
    type: Sequelize.FLOAT(53),
    allowNull: true,
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
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true
});

var Attendee = sequelize.define('Attendee', {
    eventId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
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
  inviteId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  inviteeId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  accepted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
}, {
  timestamps: true
});

// Create the tables in the database
User.sync();
Event.sync();
Attendee.sync();
Friend.sync();

// Make all Models available in Router
exports.User = User;
exports.Event = Event;
exports.Attendee = Attendee;
exports.Friend = Friend;
