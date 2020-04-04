
'use strict';

/**
 * Module dependencies.
 */
const nodemailer = require('nodemailer');
const path = require('path'),
  _ = require('lodash'),
  handlebars = require('handlebars'),
  fs = require('fs');


const readHTMLFile = function (path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

exports.sendEmail = function (req, res) {

  readHTMLFile(path.resolve(__dirname, '..') + '/views/email.template.server.view.html', function(err, html) {

    const data = req.body;

    const template = handlebars.compile(html);
    const replacements = {
      message: req.body.message,
      name: req.user.displayName
      // profile: req.user.profileImageURL
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "Gmail",
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "project.group.470@gmail.com",
        pass: "green20koala"
      }
    });

    const mailOptions = {
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
          res.status(422).send("Error: email not sent");

        }
        else{
          res.status(200).send("Email sent");
        }
    });
  });

};

