'use strict';

/**
 * Module dependencies.
 */
const passport = require('passport')
const nodemailer = require('nodemailer')
var path = require('path'),
  // mongoose = require('mongoose'),
  // email = require(path.resolve('./modules/core/server/models/email.server.model')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

  var handlebars = require('handlebars');
  var fs = require('fs');
  

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};

exports.sendEmail = function (req, res) {

  readHTMLFile(path.resolve(__dirname, '..') + '/views/email.template.server.view.html', function(err, html) {

    var data = req.body;

    var template = handlebars.compile(html);
    var replacements = {
        message: req.body.message
    };
    var htmlToSend = template(replacements);

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "Gmail",
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "project.group.470@gmail.com",
        pass: "green20koala"
      }    
    });

    var mailOptions = {
      from: req.user.email,
      to: data.to,
      subject: data.subject,
      cc: data.cc,
      bcc: data.bcc,
      html: htmlToSend
    };
  
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
        else{
          console.log("mail sent");
        }
    });
  });  
  
}
