var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var Password = new Schema({
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

Password.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

Password.virtual('password')
  .set(function (password) {
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
      return (this.hashedPassword) ? true : null;
    }
  );

Password.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = Password;