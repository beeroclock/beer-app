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
 secret: 'dgdjkgd34',
 resave: true,
 saveUninitialized: false,
 cookie: {maxAge: 1000*60*60}
}));

// Set what we are listening on.
app.set("port", process.env.PORT || 8000);

// Logging and parsing
app.use(parser.json());

// Serving static files from client directory.
app.use(express.static(__dirname + '/client/'));

// Set up our routes
app.use("/", router);

// If we are being run directly, run the server.
if (!module.parent) {
    app.listen(app.get("port"));
    console.log("Listening on", app.get("port"));
}
