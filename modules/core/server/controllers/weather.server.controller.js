'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.getWeather = function (req, res) {
  var data = req.body;
  console.log("GETWEATHER CALLED@@@@@");
  console.log(data.location);
}

/**
 * Create a Weather
 */
exports.create = function (req, res) {

};

/**
 * Show the current Weather
 */
exports.read = function (req, res) {

};

/**
 * Update a Weather
 */
exports.update = function (req, res) {

};

/**
 * Delete an Weather
 */
exports.delete = function (req, res) {

};

/**
 * List of Weathers
 */
exports.list = function (req, res) {

};
