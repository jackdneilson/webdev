//Load modules
var jwt = require('jsonwebtoken');
var express = require('express');

//Load models
var User = require('../models/users');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//Authenticate a single user
router.post('/', function(req, res){
    User.findOne({
        username: req.body.username
    })
        .select('username password rank experience acc_type')
        .exec(function(err, user) {
            if (err) throw err;

            //Check for empty result
            if (!user) {
                res.json({
                    success: false,
                    reason: 'No user with that username exists.'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        reason: 'Incorrect password'
                    })
                } else {
                    var token = jwt.sign({
                        id: user._id,
                        username: user.username,
                        acc_type: user.acc_type
                    }, secret, {
                        expiresIn: '24h'
                    });

                    res.json({
                       success: true,
                       token: token
                    });
                }
            }
        })
});

module.exports = router;