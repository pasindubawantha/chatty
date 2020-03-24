const mongoose = require('mongoose');
const config = require('../config/database');

// Student Schema
const StudentSchema = mongoose.Schema ({
  name: String,
  _id: String,
  password_hash: String,
  registered_year: Date,
  undergraduate: Boolean,
  stream: String,
  subjects: {
    '1': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '2': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '3': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '4': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    }
  },
  repeat_subjects: {
    '1': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '2': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '3': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    },
    '4': {
      '1': [{name:String, _id:String}],
      '2': [{name:String, _id:String}]
    }
  }
});

const Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.getStudentById = function(id, callback) {
  Student.findById(id, callback);
}

module.exports.addStudent = function(newStudent, callback) {
  newStudent.save(callback);
}

module.exports.updateStudent = function(newStudent, callback) {
  Student.updateOne(newStudent, callback);
}

module.exports.getCount = function(id, callback) {
  Student.count({_id:id}, callback);
}