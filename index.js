var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passport = require('passport');

var User = require('../user-model');

var validator = require('./utils/validator');
var passportStrategy = require('./config/passport-strategy');

var app = express();

var jsonParser = bodyParser.json();


/*****************
 * APP INITIALIZERS
 ****************/
passport.use(passportStrategy);
app.use(passport.initialize());


/*************
 * ROUTES
 ************/
app.get('/hidden', passport.authenticate('basic', { session: false }), function(req, res){
  return res.json({
    message: 'Luke, I am your father.'
  });
});

app.get('/users', function(req, res){
  User.find({}, function(err, users){
    if (err) res.status(500).json({ message: 'Internal server error' });

    return res.status(200).json(users);
  });
});

app.post('/users', jsonParser, function(req, res){
  var validatorResponse = validator('User', req);

  if (!validatorResponse.error) {
    bcrypt.genSalt(10, function(err, salt){
      if (err) return res.status(500).json({message: 'Failed to salt'});

      bcrypt.hash(validatorResponse.password, salt, function(err, hash){
        if (err) return res.status(500).json({message: 'Failed to hash pw'});

        var user = new User({
          username: validatorResponse.username,
          password: hash
        });

        user.save(function(err){
          if (err) return res.status(500).json({ message: err.errmsg });

          return res.status(201).json({ username: user.username })
        });
      });
    });

  } else {
    res.status(validatorResponse.status).json(validatorResponse.json);
  }

});


mongoose.connect('mongodb://localhost/simple-node')
  .then(function(){
    app.listen(8000, function(){
      console.log('Server started on 8000...');
    });
  })
  .catch(function(err){
    console.error(err);
  });