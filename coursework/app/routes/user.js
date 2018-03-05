//Load modules
var express = require('express');
var jwt = require('jsonwebtoken');

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
    user.rank = 'Bronze';
    user.experience = 0;
    user.save(function(err) {
        if (err) {
            switch (err.code) {
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
                        message: 'Failed to save user',
                        error: err
                    });
                    break;
            }
            return;
        }
        res.json({message: 'Success'});
    });
});

router.use(function(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
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

router.get('/me', function(req, res) {
    res.send(req.decoded);
});

router.post('/:user_id', function(req, res) {
    if (req.decoded['acc_type'] !== 'admin' && req.decoded['id'] !== req.params.user_id) {
        return res.status(403).send({
            success: false,
            reason: 'Account has insufficient privileges.'
        })
    }

    var user_id = req.params.user_id;

    var username = req.body.username;
    var password = req.body.password;
    var rankUp = req.body.rankUp;
    var experienceGained = req.body.experienceGained

    User.findOne({
        _id: user_id
    })
        .select('username password rank experience')
        .exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    reason: 'Invalid user ID.'
                });
            } else if (user) {
                if (username) user.username = username;
                if (password) user.password = password;
                if (rankUp) {
                    switch (user.rank) {
                        case 'Bronze':
                            user.rank = 'Silver';
                            break;
                        case 'Silver':
                            user.rank = 'Gold';
                            break;
                        case 'Gold':
                            user.rank = 'Platinum';
                            break;
                        case 'Platinum':
                            user.rank = 'Diamond';
                            break;
                        case 'Diamond':
                            user.rank = 'Master';
                            break;
                        case 'Master':
                            user.rank = 'Challenger';
                            break;
                    }
                }
                if (experienceGained) user.experience += experienceGained;
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