var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const fields = require('../../constants/fields').user;

var _ = require('lodash');

var Permission = require('./permission');

var User = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},

  password: {type: String},
  hash: {type: String, required: true},
  salt: {type: String, required: true},

  created: {type: Date, default: Date.now},

  preferences: {
    firstName: String,
    lastName: String,
    middleName: String,
    country: String,
    university: String,
    place: String,
    school: String,
    workplace: String
  },

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

  _permission: {
    type: Permission,
    default: Permission,
    required: true
  }
});

User.virtual('permission')
  .set(function (permission) {
    this._permission = permission;
  })
  .get(function () {
    const self = this;
    return _.mapValues(fields.permission, function (field) {
      return self._permission[field];
    });
  });

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);