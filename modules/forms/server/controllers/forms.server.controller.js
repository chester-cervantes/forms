'use strict';

require('mongodb').ObjectID;
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Form = mongoose.model('Form'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  puppeteer = require('puppeteer'),
  hb = require('handlebars'),
  utils = require('util');


/**
 * Create a Form
 */
exports.create = function(req, res) {
  console.log ( "in server.create req = " + req ); // DEBUG

  var form = new Form(req.body);
  form.user = req.user;

  saveAsPDF(form);

  form.save(function(err) {
    if (err) {
      fs.unlinkSync('pdf/' + form.form_id + '.pdf');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(form);
    }
  });
};


/**
 * Show the current Form
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var form = req.form ? req.form.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  form.isCurrentUserOwner = req.user && form.user && form.user._id.toString() === req.user._id.toString();

  res.jsonp(form);
};

/**
 * Update a Form
 */
exports.update = function(req, res) {
  var form = req.form;

  form = _.extend(form, req.body);

  saveAsPDF(form);

  form.save(function(err) {
    if (err) {
      fs.unlinkSync('pdf/' + form.form_id + '.pdf');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(form);
    }
  });
};

/**
 * Delete a Form
 */
exports.delete = function(req, res) {
  var form = req.form;

  // delete associated pdf file
  fs.unlinkSync('pdf/' + form.form_id + '.pdf');

  form.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(form);
    }
  });
};

/**
 * List of Forms
 */
exports.list = function(req, res) {
  Form.find().sort('-created').populate('user', 'displayName').exec(function(err, forms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      forms.forEach(e => {
        if(!checkIfPdfExists('pdf/' + e.project_id + '.pdf')){
          saveAsPDF(e);
        }
      });
      res.jsonp(forms);
    }
  });
};

/**
 * Get a PDF file
 */
exports.getPdf = function (req, res, next) {

  const path = 'pdf/' + req.params.id + '.pdf';
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path);
    res.contentType("application/pdf");
    res.send(data);
  }
  else{
    return res.status(400).send({
      message: 'Form is invalid'
    });
  }

};


/**
 * Form middleware
 */

exports.formByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Form is invalid'
    });
  }

  Form.findById(id).populate('user', 'displayName').exec(function (err, form) {
    if (err) {
      return next(err);
    } else if (!form) {
      return res.status(404).send({
        message: 'No Form with that identifier has been found'
      });
    }
    req.form = form;
    next();
  });
};


/*
  Helper function for PDF
 */
function parseData(form){

  const index = form.project_location.indexOf(',');

  return {
    form: form,
    addressLine1: index > 0 ? form.project_location.slice(0, index) : form.project_location,
    addressLine2: index > 0 ? form.project_location.slice(index + 1, form.project_location.length) : "",
    date: form.report_date_time.getFullYear() + "-" + (form.report_date_time.getMonth() + 1) + "-" + form.report_date_time.getDate(),
    time: form.report_date_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }),
    approved: form.inspection_status === "Approved",
    not_approved: form.inspection_status === "Not Approved",
    reinspection_required: form.inspection_status === "Reinspection Required"
  }
}

/*
  Function to save a form as pdf
 */

function checkIfPdfExists(path) {
  return fs.existsSync(path);
}

function saveAsPDF(form){

  if (!fs.existsSync('pdf')){
    fs.mkdirSync('pdf');
  }

  const pathToPDF = 'pdf/' + form.project_id + '.pdf';

  const readFile = utils.promisify(fs.readFile);
  async function getTemplateHtml() {
    console.log("Loading template file in memory");
    try {
      const invoicePath = path.resolve("modules/forms/client/views/view-form-pdf.view.html");
      return await readFile(invoicePath, 'utf8');
    } catch (err) {
      return Promise.reject("Could not load html template");
    }
  }
  async function generatePdf() {
    let data = parseData(form);
    getTemplateHtml().then(async (res) => {
      console.log("Compiling the template with handlebars");
      const template = hb.compile(res, { strict: true });
      const html = template(data);
      const browser = await puppeteer.launch({ignoreHTTPSErrors: true});
      const page = await browser.newPage();
      await page.setContent(html);
      await page.pdf({ path: pathToPDF, format: 'A4' });
      await browser.close();
      console.log("PDF Generated")
    }).catch(err => {
      console.error(err)
    });
  }
  generatePdf();
  form.pdf_location = pathToPDF;
  console.log("path: " + form.pdf_location);

}
