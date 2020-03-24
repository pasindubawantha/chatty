const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passwordHash = require('password-hash');
const log = require('bunyan').createLogger({name: 'Give My Space'});


router.post('/', (req, res, next) =>{
    // log.warn(req.body);
  User.getCount(req.body.id, (err, count) => {
    if (count == 1) {
      User.getUserById(req.body.id, (err, User) => {
        if(err) {
          res.json({
            success:false, 
            error: err, 
            message: "Database error",
            token:null,
            User:null
          });
        } else {
          // log.info(passwordHash.generate(req.body.password))
          // log.info(User.password_hash );
          if(User.password_hash == req.body.password) {
            res.json({
              success:true, 
              error: err, 
              message: "Loggedin Successfully",
              token:"123",
              User:User
            });
          } else {
            res.json({
              success:false, 
              error: err, 
              message: "Incorrect password",
              token:null,
              User:null
            });
          }
        }
      })
    } else {
      res.json({
        success:false, 
        error: err, 
        message: "Icorrect User Id",
        token:null,
        User:null
      });
    }
  });
  
});

module.exports = router;
