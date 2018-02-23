//Import packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
var port = process.env.PORT || 8080;
var jwt = require('jsonwebtoken');

var secret = 'thisshouldreallyhavemoreentropy';

//Use bodyparser to log POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set headers to allow CORS requests
app.use(function(req, resp, next) {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    resp.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

//Log all requests to console
app.use(morgan('dev'));

//Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/test');

//Routing
app.get('/', function(req, resp) {
    resp.send('Home page');
});

//Get instance of express router
var apiRouter = express.Router();

//Route for authentication
apiRouter.post('/authenticate', function(req, resp) {
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {
        if (err) throw err;

        if (!user) {
            resp.json({
                success: false,
                message: 'Authentication failed, user not found.'
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                resp.json({
                    success: false,
                    message: 'Authentication failed, incorrect password.'
                });
            } else {
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, secret, {
                    expiresIn: '24h'
                });

                resp.json({
                    sucess: true,
                    message: 'Success',
                    token: token
                });
            }
        }
    });
});

//Middleware to check for authentication
apiRouter.use(function(req, resp, next) {
   console.log('API requested');
   next();
});

//Route for users
apiRouter.route('/users')
    .post(function(req, resp) {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err) {
           if (err) {
               if (err.code == 11000) {
                   return resp.json({ success: false, message: 'A user with that username already exists.'});
               } else {
                   resp.send(err)
               }
           }

           resp.json({ message: 'User created'});
        });
    })

    .get(function(req, resp) {
       User.find(function(err, users) {
          if (err) return resp.send(err);
          resp.json(users)
       });
    });

apiRouter.route('/users/:user_id')
    .get(function (req, resp) {
        User.findById(req.params.user_id, function(err, user) {
           if (err) return resp.send(err);

           resp.json(user);
        });
    })

    .put(function(req, resp) {
       User.findById(req.params.user_id, function(err, user) {
           if (err) return resp.send(err);

           if (req.body.name) user.name = req.body.name;
           if (req.body.username) user,username = req.body.username;
           if (req.body.password) user.password = req.body.password;

           user.save(function(err) {
              if (err) return resp.send(err);

              resp.json({ message: 'User updated' });
           });
       });
    })

    .delete(function(req, resp) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) return res.send(err);

            res.json({ message: 'Successfully deleted' })
        });
    });


//Register routes
app.use('/api', apiRouter);

//Start the server
app.listen(port)
console.log('Magic happens on port ' + port);