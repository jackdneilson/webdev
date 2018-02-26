//Load modules
var express = require('express');

//Load models
var User = require('../models/user.js');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

router.post('/', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.rank = req.body.rank;
    user.save(function(err) {
        if (err) {
            switch (err) {
                case 'rank':
                    res.json({
                        message: 'Failed to save user',
                        reason: 'Rank must be Bronze, Silver, Gold, Platinum, Diamond, Master or Challenger.'
                    });
                    break;

                case 11000:
                    res.json({
                        message: 'Failed to save user',
                        reason: 'User already exists'
                    });
                    break;

                default:
                    res.json({
                        message: 'Failed to save user'
                    });
                    break;
            }
            return;
        }
        res.json({message: 'Success'});
    });
});

router.use(function(req, res, next) {
    //var authToken = req.params.authToken;
    //TODO: Validate token
    next();
});

//TODO: Add route for updating user

module.exports = router;