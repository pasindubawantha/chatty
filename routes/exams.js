const express = require('express');
const router = express.Router();
const Exam = require('../models/exam');
const authMiddleware = require('../middleware/auth-middleware')

router.use(authMiddleware)

// Add
router.post('/', (req, res, next) => {
  const newExam = new Exam ({
    date: req.body.date,
    _id: req.body.code,
    year: req.body.year,
    semester: req.body.semester,
    undergraduate: req.body.undergraduate,
    stream: req.body.stream,
  });
  Exam.addExam(newExam, (err, exam) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register subject', err:err});
    } else {
      res.json({success: true, msg: 'Subject registered', err: err});
    }
  });
})


router.get('/', (req, res, next) =>{

    Exam.getExams((err, exams) => {
        if(err) {
        res.json(err);
        } else {
        res.json(exams);
        }
    });
})

module.exports = router;