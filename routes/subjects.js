const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const authMiddleware = require('../middleware/auth-middleware')

router.use(authMiddleware)

// Add
router.post('/', (req, res, next) => {
  const newSubject = new Subject ({
    name: req.body.name,
    _id: req.body.code,
    year: req.body.year,
    semester: req.body.semester,
    undergraduate: req.body.undergraduate,
    stream: req.body.stream,
  });
  Subject.addSubject(newSubject, (err, subject) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register subject'});
    } else {
      res.json({success: true, msg: 'Subject registered', err: err});
    }
  });
})


router.get('/:grad/:stream/:year/:semester', (req, res, next) =>{
  const undergrad = true
  if(req.params['grad'] == "graduate"){
    undergrad = false
  }
  const subject = { 
    undergraduate: undergrad, 
    stream: req.params['stream'], 
    year: req.params['year'], 
    semester: req.params['semester']
  }

  Subject.getSubjects(subject, (err, subjects) => {
    if(err) {
      res.json(err);
    } else {
      res.json(subjects);
    }
  });
})

router.get('/:id', (req, res, next) =>{
  Student.getSubjectById(req.params.id, (err, subject) => {
    if(err) {
      res.json(err);
    } else {
      res.json(subject);
    }
  })
});

module.exports = router;