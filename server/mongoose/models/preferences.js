var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fields = require('../../constants/fields').user.preferences.fields;

const view = _.reduce(fields, function (previous, field) {
  var current = Object.assign({}, previous);
  current[field] = {
    type: String,
    default: '...',
    required: true
  };
  return current;
}, {});

var Preferences = new Schema(view);

module.exports = Preferences;