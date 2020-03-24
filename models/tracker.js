const mongoose = require('mongoose');

const TrackerSchema = mongoose.Schema ({
  _id: String,
  pair_password: String,
  secret: String,
  public_key: String,
  history_count: Number,
  history: [{
    _id: Number,
    position: {
      accuracy: Number,
      altitude: Number,
      lat: Number,
      lon: Number,
      speed: Number
    },
    battery: {
      level: Number,
      charging: Boolean
    }
  }],
});

const Tracker = module.exports = mongoose.model('tracker', TrackerSchema);

module.exports.getTrackerById = function(id, callback) {
  Tracker.findById(id, callback);
}

module.exports.addTracker = function(newTracker, callback) {
  newTracker.save(callback);
}

module.exports.updateTracker = function(id, newTracker, callback) {
  Tracker.getTrackerById(id, (err, tracker) => {
    if(tracker){
      tracker.remove((err)=> {
        if(err){
          console.log("Error updating tracker")
          console.log(err)
        }else{
          newTracker.save(callback);
        }
      })
    } else {
      console.log("No tracker to update")
    }
    
  })
}



module.exports.getAllTrackers = function(callback) {
  Tracker.find({}, callback);
}

module.exports.deleteAllTrackers = function() {
  Tracker.collection.drop();
}
