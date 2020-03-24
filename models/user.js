const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
  _id: String,
  password_hash: String,
  email: String,
  facebook_id: String,
  trackers: [{
    tracker_id: String,
    geo_fences: [{
      center: {
        lat: Number,
        lon: Number
      },
      radius: Number,
      colour: String,
      name: String,
      notify: Boolean
    }]
  }],
});

const User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.addUser = function(newUser, callback) {
  newUser.save(callback);
}


module.exports.getCount = function(id, callback) {
  User.count({_id:id}, callback);
}