//Load modules
var express = require('express');
var jwt = require('jsonwebtoken');

//Load models
var User = require('../models/users.js');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//Route to create new admin user
//Route to add new user
router.post('/', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.rank = 'Bronze';
    user.experience = 0;
    user.acc_type = 'Admin';
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


module.exports = router;