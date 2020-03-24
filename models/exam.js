const mongoose = require('mongoose');
const config = require('../config/database');

// Exam Schema
const ExamSchema = mongoose.Schema ({
  date: Date,
  _id: String,//exam code
  year: Number,
  semester: Number,
  undergraduate: Boolean,
  stream: String
});
const Exam = module.exports = mongoose.model('Exam', ExamSchema);

module.exports.getExams = function(callback) {
    Exam.find({}, callback);
}

module.exports.addExam = function(newExam, callback) {
  newExam.save(callback);
}