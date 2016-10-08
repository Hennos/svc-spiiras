var nconf = require('nconf');
var mongoose = require('mongoose');

var options = nconf.get('database');

mongoose.Promise = global.Promise;

mongoose.connect(options.host + '/' + options.name);
var mongooseConnection = mongoose.connection;
var User = require('./models/user');
var _ = require('underscore');

mongooseConnection.on('error', function (err) {
  console.error('Database connection failed.', err);
  throw err;
});

mongooseConnection.on('open', function (cb) {
  console.info('Database connection established.');
});

module.exports = mongooseConnection;