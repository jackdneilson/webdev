//Load modules
var express = require('express');
var jwt = require('jsonwebtoken');

//Load models
var User = require('../models/users');

//Load config
var config = require('../../config');
var secret = config.secret;

var router = express.Router();

//Helper function to compare experience in the case of equal rank.
function compareExperience(user1, user2) {
    if (user1.experience.valueOf() > user2.experience.valueOf()) {
        return 1;
    } else if (user1.experience.valueOf() === user2.experience.valueOf()) {
        return 0;
    } else {
        return -1;
    }
}

//Get top 20 players, sorting done on server side due to lack of complex sort from mongoose
router.get('/', function(req, res) {
    User
        .find({acc_type: 'User'})
        .select('username rank experience')
        .exec(function(err, users) {
            users.sort(function(user1, user2) {
                switch (user1.rank.valueOf()) {
                    case 'Challenger':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Master':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                                return -1;
                            case 'Master':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Diamond':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                            case 'Master':
                                return -1;
                            case 'Diamond':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Platinum':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                            case 'Master':
                            case 'Diamond':
                                return -1;
                            case 'Platinum':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Gold':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                            case 'Master':
                            case 'Diamond':
                            case 'Platinum':
                                return -1;
                            case 'Gold':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Silver':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                            case 'Master':
                            case 'Diamond':
                            case 'Platinum':
                            case 'Gold':
                                return -1;
                            case 'Silver':
                                return compareExperience(user1, user2);
                            default:
                                return 1;
                        }

                    case 'Bronze':
                        switch (user2.rank.valueOf()) {
                            case 'Challenger':
                            case 'Master':
                            case 'Diamond':
                            case 'Platinum':
                            case 'Gold':
                            case 'Silver':
                                return -1;
                            default:
                                return compareExperience(user1, user2);
                        }
                }
            });

            if (users.length > 20) {
                res.json(users.slice(0, 19));
            } else {
                res.json(users);
            }
        });
});

module.exports = router;