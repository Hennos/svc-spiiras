var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

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

  permission: {
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
      default:true,
      required: true
    },
    interactiveBoard: {
      type: Boolean,
      default: true,
      required: true
    },
    passwordExitProfile: {
      type: Boolean,
      default: true,
      required: true
    },
    passwordManipulationOfAudioVideo: {
      type: Boolean,
      default: true,
      required: true
    }
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);