//Load modules
var jwt = require('jsonwebtoken');
var express = require('express');

//Load models
var User = require('../models/user');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//Authenticate a single user
router.post('/', function(req, res){
    User.findOne({
        username: req.body.username
    })
        .select('username password')
        .exec(function(err, user) {
            if (err) throw err;

            //Check for empty result
            if (!user) {
                res.json({
                    message: 'Failed to authenticate',
                    reason: 'No user with that username exists.'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        message: 'Failed to authenticate',
                        reason: 'Incorrect password'
                    })
                } else {
                    var token = jwt.sign({
                        id: user._id,
                        username: user.username,
                        rank: user.rank,
                        experience: user.experience,
                        acc_type: user.acc_type
                    }, secret, {
                        expiresIn: '24h'
                    });

                    res.json({
                       message: 'Success',
                       token: token
                    });
                }
            }
        })
});

module.exports = router;