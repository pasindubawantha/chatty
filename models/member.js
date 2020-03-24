const mongoose = require('mongoose');
const config = require('../config/database');

// Member Schema
const MemberSchema = mongoose.Schema ({
  _id: String,//username
  password: String,
});

const Member = module.exports = mongoose.model('Member', MemberSchema);


module.exports.getMemberById = function(id, callback) {
  Member.findById(id, callback);
}

module.exports.addMember = function(newMember, callback) {
  newMember.save(callback);
}

module.exports.getCount = function(id, callback) {
  Member.count({_id:id}, callback);
}