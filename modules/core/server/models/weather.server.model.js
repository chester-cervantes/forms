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

mongoose.model('Weather', WeatherSchema);
