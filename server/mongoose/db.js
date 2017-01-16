var config = require('nconf');
var mongoose = require('mongoose');

var options = config.get('database');

mongoose.Promise = global.Promise;

mongoose.connect(options.host + '/' + options.name);
var mongooseConnection = mongoose.connection;
var User = require('./models/user');

mongooseConnection.on('error', function (err) {
  console.error('Database connection failed.', err);
  throw err;
});

mongooseConnection.on('open', function (cb) {
  console.info('Database connection established.');
});

module.exports = mongooseConnection;