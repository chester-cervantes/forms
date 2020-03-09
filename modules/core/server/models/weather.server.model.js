'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Weather Schema
 */
var WeatherSchema = new Schema({
  // Weather model fields
  // ...
  location: {
    type: String,
    trim: true,
    default: ''
  }
});

module.exports = mongoose.model('Weather', WeatherSchema);
