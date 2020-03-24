const express = require('express');
const router = express.Router();
const User = require('../models/user');
const log = require('bunyan').createLogger({name: 'Give My Space'});
const passwordHash = require('password-hash');

function createRouter(socket){
  router.post('/register', (req, res, next) => {
  
    let newUser = new User ({
      _id: req.body.username,
      password_hash: req.body.password
    });
  
    User.addUser(newUser, (err, User) => {
      if(err) {
        res.json({success: false, message: 'Failed to register User', err:err});
      } else {
        res.json({success: true, message: 'User registered', err:err});
      }
    });
  });
  
  router.get('/', (req, res, next) =>{
    log.info(req.params)
      User.getUserById(req.params.id, (err, User) => {
        if(err) {
          res.json(err);
        } else {
          res.json(User);
        }
      })
    });
  
  router.get('/trackers/:username', (req, res, next) =>{
    User.getUserById(req.params.username, (err, User) => {
      if(err) {
        let response = {};
        response.message = "Failed to get trackers"
        response.success = false;
        response.error = err;
        res.json(response);
      } else {
        let response = {};
        response.message = "Sucessfuly got trackers"
        response.success = true;
        response.trackers = User.trackers;
        res.json(response);
      }
    })
  });

  return router
}

module.exports = createRouter;