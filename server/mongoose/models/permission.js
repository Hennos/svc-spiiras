var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var Password = require('./password');

var Permission = new Schema({
  makeCalls: {
    type: Boolean,
    default: true,
    required: true
  },
  addingFriends: {
    type: Boolean,
    default: true,
    required: true
  },
  forcedCall: {
    type: Boolean,
    default: true,
    required: true
  },
  interactiveBoard: {
    type: Boolean,
    default: true,
    required: true
  },
  passwordExitProfile: {
    type: Password,
    default: false,
    required: true
  },
  passwordManipulationOfAudioVideo: {
    type: Password,
    default: false,
    required: true
  }
});

module.exports = mongoose.model('Permission', Permission);