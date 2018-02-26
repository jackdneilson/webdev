//Load packages
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');

var config = require('./config');

//Connect to database
//TODO: Add logic for remote database
//TODO: Add logic for failure to connect
var con = mongoose.connect(config.database);

//Load routes
var userRoute = require('./app/routes/user');
var authRoute = require('./app/routes/authenticate');
var leaderboardRoute = require('./app/routes/leaderboard');

//Load models
var User = require('./app/models/user');

//Configure CORS requests - INSECURE
//TODO: Secure CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

//If debug is set, log all requests to console
if (config.debug) {
    console.log('Debug is true, logging all requests.');
    var morgan = require('morgan');
    app.use(morgan('dev'));
}

//Set routes
app.use('/user', userRoute);
app.use('/authenticate', authRoute);
app.use('/leaderboard', leaderboardRoute);
app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
console.log('Started listening on port '+ config.port);