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

    next();
});

//Route to get information about current user (stored in token auth middleware)
router.get('/', function(req, res) {
    res.send(req.decoded);
});

//Route to update a single user given id
router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var experienceGained = req.body.experienceGained;

    if (req.decoded['acc_type'] !== 'admin' && req.decoded['id'] !== user_id) {
        return res.status(403).send({
            success: false,
            reason: 'Account has insufficient privileges.'
        })
    }

    User.findOne({
        username: username
    })
        .select('username password rank experience acc_type')
        .exec(function(err, user) {
            if (err) {
                switch (err.code) {
                    default:
                        res.json({
                            success: false,
                            reason: err
                        })
                }
            }

            if (!user) {
                res.json({
                    success: false,
                    reason: 'Invalid user ID.'
                });
            } else if (user) {
                if (username) user.username = username;
                if (password) user.password = password;
                if (experienceGained) user.experience += experienceGained;
                if (user.experience > 10000) {
                    switch (user.rank) {
                        case 'Bronze':
                            user.experience -= 10000;
                            user.rank = 'Silver';
                            break;
                        case 'Silver':
                            user.experience -= 10000;
                            user.rank = 'Gold';
                            break;
                        case 'Gold':
                            user.experience -= 10000;
                            user.rank = 'Platinum';
                            break;
                        case 'Platinum':
                            user.experience -= 10000;
                            user.rank = 'Diamond';
                            break;
                        case 'Diamond':
                            user.experience -= 10000;
                            user.rank = 'Master';
                            break;
                        case 'Master':
                            user.experience -= 10000;
                            user.rank = 'Challenger';
                            break;
                    }
                }
            }
        })
        .save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    reason: err
                });
                return;
            }

            //Token contents no longer consistent with state, must regenerate.
            var token = jwt.sign({
                id: user.id,
                username: user.username,
                rank: user.rank,
                experience: user.experience,
                acc_type: user.acc_type
            }, secret, {
                expiresIn: '24h'
            });

            window.localStorage.setItem('token', token);
            return res.json({
                success: true
            })
        });
});

module.exports = router;