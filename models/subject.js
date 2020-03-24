const mongoose = require('mongoose');
const config = require('../config/database');

// Subject Schema
const SubjectSchema = mongoose.Schema ({
  name: String,
  _id: String,
  year: Number,
  semester: Number,
  undergraduate: Boolean,
  stream: String,
  repeat_students: {type:Number,default:0},
  students: {type:Number,default:0}
});
const Subject = module.exports = mongoose.model('Subject', SubjectSchema);

module.exports.getSubjects = function(subject, callback) {
  Subject.find(subject, callback);
}

module.exports.getSubjectById = function(id, callback) {
  Subject.findById(id, callback);
}

module.exports.addSubject = function(newSubject, callback) {
  newSubject.save(callback);
}

module.exports.incrimentSubjectStudentNumber = function(subjects, callback) {
  const year = new Date().getFullYear();
  Subject.updateMany(subjects, { $inc: { students: 1 } }, {new: true }, callback)
}

module.exports.incrimentSubjectRepeatStudentNumber = function(subjects, callback) {
  const year = new Date().getFullYear();
  Subject.updateMany(subjects, { $inc: { repeat_students: 1 } }, {new: true }, callback)
}

module.exports.decrimentSubjectStudentNumber = function(subjects, callback) {
  Subject.updateMany(subjects, { $inc: { students: -1 } }, {new: true }, callback)
}

module.exports.decrimentSubjectRepeatStudentNumber = function(subjects, callback) {
  Subject.updateMany(subjects, { $inc: { repeat_students: -1 } }, {new: true }, callback)
}