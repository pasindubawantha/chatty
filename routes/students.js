const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Subject = require('../models/subject');
const _ = require('lodash');
const authMiddleware = require('../middleware/auth-middleware')

router.use(authMiddleware)

// Register
router.post('/register', (req, res, next) => {
  const newStudent = new Student ({
    name: req.body.name,
    _id: req.body.registration_number,
    password_hash: req.body.password_hash,
    registered_year: req.body.registered_year,
    undergraduate: req.body.undergraduate,
    stream: req.body.stream,
  });

  Student.addStudent(newStudent, (err, student) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register student'});
    } else {
      res.json({success: true, msg: 'Student registered'});
    }
  });
});

router.get('/:id', (req, res, next) =>{
  Student.getStudentById(req.params.id, (err, student) => {
    if(err) {
      res.json(err);
    } else {
      res.json(student);
    }
  })
});

router.post('/:id/subjects/:year/:semester', (req, res, next) => {
  let new_subjects = req.body
  // let newStudent = new Student ({
  //   _id: req.params['id'],
  //   subjects[req.params['year']][req.params['semester']] : new_subjects
  // });

  Student.getStudentById(req.params.id, (err, student) => {
    if(err) {
      res.json(err);
    } else {
      let old_subjects = student.subjects[req.params['year']]
      if(old_subjects != null){
        old_subjects = student.subjects[req.params['year']][req.params['semester']]
      }
      let remove_subjects = _.differenceBy(old_subjects, new_subjects, '_id')
      let add_subjects = _.differenceBy(new_subjects, old_subjects, '_id')

      remove_subjects = _.map(remove_subjects, (element) => element._id)
      add_subjects = _.map(add_subjects, (element) => element._id)
      //res.json({add:add_subjects, remove:remove_subjects, new:new_subjects ,old:old_subjects})
      remove_subjects = { _id: { $in: remove_subjects } }
      add_subjects = { _id: { $in: add_subjects } }
      Subject.incrimentSubjectStudentNumber(add_subjects,(err, subject) => {
        if(err) {
          res.json({success: false, msg: 'Failed to updae student', error: err});
        } else {
          
          Subject.decrimentSubjectStudentNumber(remove_subjects, (err, subject) => {
            if(err) {
              res.json({success: false, msg: 'Failed to updae student', error: err});
            } else {
              student.subjects[req.params['year']][req.params['semester']] = new_subjects
              Student.updateStudent(student, (err, student) => {
                if(err) {
                  res.json({success: false, msg: 'Failed to updae student', error: err});
                } else {
                  res.json({success: true, msg: 'Sucess', subject: student});
                }

              })
            }
          })
          
        }
      })  
    }
  })
})

router.post('/:id/repeat/:year/:semester', (req, res, next) => {
  let new_subjects = req.body
  // let student_subjects = {}
  // student_subjects[req.params['year']] = {}
  // student_subjects[req.params['year']][req.params['semester']] = new_subjects
  // let newStudent = new Student ({
  //   _id: req.params['id'],
  //   repeat_subjects[req.params['year']][req.params['semester']]: student_subjects
  // });

  Student.getStudentById(req.params.id, (err, student) => {
    if(err) {
      res.json(err);
    } else {
      let old_subjects = student.repeat_subjects[req.params['year']]
      if(old_subjects != null){
        old_subjects = student.repeat_subjects[req.params['year']][req.params['semester']]
      }
      let remove_subjects = _.differenceBy(old_subjects, new_subjects, '_id')
      let add_subjects = _.differenceBy(new_subjects, old_subjects, '_id')

      remove_subjects = _.map(remove_subjects, (element) => element._id)
      add_subjects = _.map(add_subjects, (element) => element._id)
      //res.json({add:add_subjects, remove:remove_subjects, new:new_subjects ,old:old_subjects})
      remove_subjects = { _id: { $in: remove_subjects } }
      add_subjects = { _id: { $in: add_subjects } }
      Subject.incrimentSubjectRepeatStudentNumber(add_subjects,(err, subject) => {
        if(err) {
          res.json({success: false, msg: 'Failed to updae student', error: err});
        } else {
          
          Subject.decrimentSubjectRepeatStudentNumber(remove_subjects, (err, subject) => {
            if(err) {
              res.json({success: false, msg: 'Failed to updae student', error: err});
            } else {
              
              student.repeat_subjects[req.params['year']][req.params['semester']] = new_subjects
              Student.updateStudent(student, (err, student) => {
                if(err) {
                  res.json({success: false, msg: 'Failed to updae student', error: err});
                } else {
                  res.json({success: true, msg: 'Sucess', subject: student});
                }

              })
            }
          })
          
        }
      })  
    }
  })
})

module.exports = router;
