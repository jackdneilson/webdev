//Load modules
var express = require('express');
var jwt = require('jsonwebtoken');

//Load models
var User = require('../models/users.js');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//Route to add new user
router.post('/new', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.rank = 'Bronze';
    user.experience = 0;
    user.acc_type = 'User';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                    res.json({
                        success: false,
                        reason: 'User already exists'
                    });
                    break;

                default:
                    res.json({
                        success: false,
                        reason: err
                    });
                    break;
            }
            return;
        }
        res.json({success: true});
    });
});

//Middleware to check valid token exists
router.use(function(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    reason: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            reason: 'No token provided.'
        })
    }
});

//Route to get information about current user (stored in token auth middleware)
router.get('/', function(req, res) {
    res.send(req.decoded);
});

//Route to update a single user's experience
router.post('/update', function(req, res) {
    var username = req.decoded['username'];
    var experienceGained = req.body.experienceGained;

    User.findOne({
        username: username
    })
        .select('username rank experience acc_type')
        .exec(function(err, user) {
            if (err) {
                res.json({
                    success: false,
                    reason: err
                });
            } else {
                if (!user) {
                    res.json({
                        success: false,
                        reason: 'Invalid user ID.'
                    });
                } else if (user) {
                    if (experienceGained) user.experience += experienceGained;
                    while (user.experience > 1000 && user.rank !== 'Challenger') {
                        //Switch to rank up user
                        switch (user.rank) {
                            case 'Bronze':
                                user.experience -= 1000;
                                user.rank = 'Silver';
                                break;
                            case 'Silver':
                                user.experience -= 1000;
                                user.rank = 'Gold';
                                break;
                            case 'Gold':
                                user.experience -= 1000;
                                user.rank = 'Platinum';
                                break;
                            case 'Platinum':
                                user.experience -= 1000;
                                user.rank = 'Diamond';
                                break;
                            case 'Diamond':
                                user.experience -= 1000;
                                user.rank = 'Master';
                                break;
                            case 'Master':
                                user.experience -= 1000;
                                user.rank = 'Challenger';
                                break;
                        }
                    }

                    user.save();
                }
            }
        });
});

module.exports = router;