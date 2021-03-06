//Load modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Set global variables
var RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Challenger"];
var ACC_TYPES = ["User", "Admin"];

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },

    password: {
        type: String,
        required: true,
        index: { unique: true }
    },

    rank: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    acc_type: {
        type: String,
        required: true
    }
}, {collection: 'coachio'});

//Hash password before user is saved
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
       if (err) {
           return next(err);
       }

       user.password = hash;
       next();
    });
});

//Validate rank is in list of accepted values before updating
UserSchema.pre('save', function(next) {
    var user = this;
    var rank = user.rank.valueOf();
    if (!(RANKS.includes(rank))) {
        return next({code: 'rank'});
    }
    next();
});

//Validate account type is in list of accepted values before updating
UserSchema.pre('save', function(next) {
    var user = this;
    var accType = user.acc_type.valueOf();
    if (!(ACC_TYPES.includes(accType))) {
        return next({code: 'accountType'});
    }
    next();
});

//Method to compare hashed passwords
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);