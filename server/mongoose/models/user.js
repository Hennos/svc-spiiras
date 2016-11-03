var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String},
  firstName: {type: String},
  lastName: {type: String},
  middleName:{type: String},
  country:{type: String},
  university:{type: String},
  place:{type: String},
  school:{type: String},
  workplace:{type: String},
  hash: {type: String, required: true},
  salt: {type: String, required: true},
  created: {type: Date, default: Date.now},
  makecalls:{type: Boolean},
  addingfriends:{type: Boolean},
  forcedchallenge:{type: Boolean},
  interactiveboard:{type: Boolean},
  passwordexitprofile:{type: Boolean},
  passwordmanipulationofaudiovideo:{type: Boolean},
  admined: [{type: Schema.Types.ObjectId, ref: 'User'}],
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
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);