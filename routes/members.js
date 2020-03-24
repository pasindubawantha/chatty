const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// Register
router.post('/register', (req, res, next) => {
  let newMember = new Member ({
    _id: req.body.username,
    password: req.body.password
  });

  Member.addMember(newMember, (err, member) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register member', err:err});
    } else {
      res.json({success: true, msg: 'Member registered', err:err});
    }
  });
});

router.get('/:id', (req, res, next) =>{
    Member.getMemberById(req.params.id, (err, member) => {
      if(err) {
        res.json(err);
      } else {
        res.json(member);
      }
    })
  });


module.exports = router;