//Load packages
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var io = require('socket.io').listen(server);

//Set config
var config = require('./config');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Connect to database
//TODO: Add logic for remote database
//TODO: Add logic for failure to connect
var con = mongoose.connect(config.database);

//Load routes
var userRoute = require('./app/routes/user');
var authRoute = require('./app/routes/authenticate');
var leaderboardRoute = require('./app/routes/leaderboard');

//Load models
var User = require('./app/models/users');

//Configure CORS requests - INSECURE
//TODO: Secure CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

//If debug is set, log all requests to console and allow admin routes
if (config.debug) {
    console.log('Debug is true, logging all requests.');
    var morgan = require('morgan');
    app.use(morgan('dev'));

    var adminRoute = require('./app/routes/admin');
    app.use('/admin', adminRoute);
}

//Set routes
app.use('/api/user', userRoute);
app.use('/api/authenticate', authRoute);
app.use('/api/leaderboard', leaderboardRoute);
app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

io.sockets.on('connection', function(socket) {
    socket.on('send message', function(data) {
        io.sockets.emit('new message', data);
    })
});

server.listen(config.port);
console.log('Started listening on port '+ config.port);