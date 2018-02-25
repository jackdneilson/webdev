//Load packages
var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Connect to database
//TODO: Add logic for remote database
//TODO: Add logic for failure to connect
var con = mongoose.connect('mongodb://localhost:27017/coachio');

//Load routes
var apiRoutes = require('./routes/api_routes');
var frontendRoutes = require('./routes/frontend_routes');

//Load models
var User = require('./models/user');

//Set default env variables
var PORT = process.env.PORT || 8080;
var DEBUG = process.env.DEBUG || false;

//Configure CORS requests - INSECURE
//TODO: Secure CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

//If debug is set, log all requests to console
if (DEBUG) {
    console.log('Debug is true, logging all requests.');
    var morgan = require('morgan');
    app.use(morgan('dev'));
}



//Set routes
//TODO: Cleanup routes
//app.use('/', frontendRoutes);
app.use('/api', apiRoutes);

app.listen(PORT);
console.log('Started listening on port '+ PORT);