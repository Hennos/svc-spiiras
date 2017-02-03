var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fields = require('../../constants/fields').user.permission.fields;

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
    default: false,
    required: true
  },
  interactiveBoard: {
    type: Boolean,
    default: true,
    required: true
  },
  _passwordExitProfile: Password,
  _passwordManipulationOfAudioVideo: Password
});

Permission.virtual(fields.passwordExitProfile)
  .set(function (password) {
    if (password) {
      this._passwordExitProfile = {password: password}
    }
  })
  .get(function () {
    if (this._passwordExitProfile) {
      return this._passwordExitProfile.password || false;
    } else {
      return false;
    }
  });

Permission.virtual(fields.passwordManipulationOfAudioVideo)
  .set(function (password) {
    if (password) {
      this._passwordManipulationOfAudioVideo = {password: password};
    }
  })
  .get(function () {
    if (this._passwordManipulationOfAudioVideo) {
      return this._passwordManipulationOfAudioVideo.password || false;
    } else {
      return false;
    }
  });

Permission.methods.checkCtrlPassword = function (ctrl, password) {
  const path = '_' + ctrl;
  if (this[path]) {
    return this[path].checkPassword(password);
  } else {
    return null;
  }
};

module.exports = Permission;