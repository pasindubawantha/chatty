const mongoose = require('mongoose');
const config = require('../config/database');

// Message Schema
const MessageSchema = mongoose.Schema ({
  time: Date,
  message: String,
  user: String
});

const Message = module.exports = mongoose.model('Message', MessageSchema);


module.exports.addMessage = function(newMessage, callback) {
  newMessage.save(callback);
}

module.exports.getMessages = function(message, callback) {
  Message.find(message, callback);
}

module.exports.deleteAllMessages = function(callback) {
    Message.collection.drop(callback);
}