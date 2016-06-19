var mysql = require('mysql');
var express = require('express');
var session = require('express-session');

//Middleware
var parser = require('body-parser');
var router = require(__dirname + '/backend/routes.js');

// Router
var app = express();
module.exports.app = app;

// Establish session
app.use(session({
 secret: 'rr1261956',
 resave: true,
 saveUninitialized: false,
 cookie: {maxAge: 1000*60*60}
}));

// Set what we are listening on.
app.set("port", process.env.PORT || 8000);

// Logging and parsing
app.use(parser.json());

//Use cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, beeroclock');
  next();
});

// Serving static files from client directory.
app.use(express.static(__dirname + '../desktop_client'));
// app.use('/',  express.static(path.join(__dirname, '../desktop_client/'))); ///what is this for?

// Set up our routes
app.use("/", router);

// If we are being run directly, run the server.
if (!module.parent) {
    app.listen(app.get("port"));
    console.log("Listening on", app.get("port"));
}
