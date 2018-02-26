//Load modules
var express = require('express');
var jwt = require('jsonwebtoken');

//Load models
var User = require('../models/user.js');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//TODO: Get users with top 10 exp
router.get('/', function(req, res) {
    //var users =
});

module.exports = router;