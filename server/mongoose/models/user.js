var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const fields = require('../../constants/fields').user;

var _ = require('lodash');

var Permission = require('./permission');
var Preferences = require('./preferences');

var User = new Schema({
  username: {type: String, required: true, unique: true},
  email: {
    type: String,
    set: function (email) {
      if (email !== null) {
        return email;
      }
      return this.email;
    },
    required: true,
    unique: true
  },

  password: {type: String},
  hash: {type: String, required: true},
  salt: {type: String, required: true},

  created: {type: Date, default: Date.now},

  friends: {
    type: [{
      type: Schema.Types.ObjectId, ref: 'User',
      unique: true
    }],
    default: []
  },
  requests: {
    type: [{
      type: Schema.Types.ObjectId, ref: 'User',
      unique: true
    }],
    default: []
  },

  admin: {type: Boolean, required: true, default: false},

  admined: {
    type: [{
      type: Schema.Types.ObjectId, ref: 'User',
      unique: true
    }],
    default: []
  },

  _preferences: {
    type: Preferences,
    default: Preferences,
    required: true
  },

  _permission: {
    type: Permission,
    default: Permission,
    required: true
  }
});

User.virtual(fields.preferences.id)
  .set(function (preferences) {
    this._preferences = preferences;
  })
  .get(function () {
    const self = this;
    return _.reduce(fields.preferences.fields,
      function (previous, field) {
        var current = Object.assign({}, previous);
        current[field] = self._preferences[field];
        return current;
      }, {});
  });

User.virtual(fields.permission.id)
  .set(function (permission) {
    this._permission = permission;
  })
  .get(function () {
    const self = this;
    return _.reduce(fields.permission.fields,
      function (previous, field) {
        var current = Object.assign({}, previous);
        current[field] = self._permission[field];
        return current;
      }, {});
  });

User.methods.checkUserExit = function (password) {
  const result = this._permission.checkCtrlPassword(fields.permission.fields.passwordExitProfile, password);
  if (result === null) {
    return true;
  } else {
    return result;
  }
};

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);