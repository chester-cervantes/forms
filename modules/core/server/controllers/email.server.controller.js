
'use strict';

/**
 * Module dependencies.
 */
const nodemailer = require('nodemailer');

exports.sendEmail = function (req, res) {

    const data = req.body;
    console.log(data);

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
      subject: req.user.displayName + " shared a report",
      text: data.message,
      attachments: [
        {
          filename: data.id + '.pdf',
          path: 'pdf/' + data.id + '.pdf',
          contentType: 'application/pdf'
        }
      ],
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

};

