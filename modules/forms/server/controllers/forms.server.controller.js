'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Form = mongoose.model('Form'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


const fs = require('fs');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const utils = require('util');


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
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(form);
    }
  });
};

/**
 * Delete an Form
 */
exports.delete = function(req, res) {
  var form = req.form;

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
      res.jsonp(forms);
    }
  });
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


function parseData(form){

  return {
    form: form,
    date: form.report_date_time.getFullYear() + "-" + (form.report_date_time.getMonth() + 1) + "-" + form.report_date_time.getDate(),
    time: form.report_date_time.getTime(),
    footings_review_type: form.footings_review_type,
    foundation_walls_review_type: form.foundation_walls_review_type,
    sheathing_review_type: form.sheathing_review_type,
    framing_review_type: form.framing_review_type,
    other_review_type: form.other_review_type,
    rebar_pos_reviewed: form.rebar_pos_reviewed,
    rebar_size_spacing_reviewed: form.rebar_size_spacing_reviewed,
    anchorage_reviewed: form.anchorage_reviewed,
    form_plan_reviewed: form.form_plan_reviewed,
    conformance_spec_reviewed: form.conformance_spec_reviewed,
    beam_girder_bearing_reviewed: form.beam_girder_bearing_reviewed,
    continuity_top_plate_reviewed: form.continuity_top_plate_reviewed,
    lintel_open_reviewed: form.lintel_open_reviewed,
    shearwalls_fastening_holddowns_reviewed: form.shearwalls_fastening_holddowns_reviewed,
    continuity_tall_walls_reviewed: form.continuity_tall_walls_reviewed,
    blocking_floor_system_reviewed: form.blocking_floor_system_reviewed,
    wall_sheathing_reviewed: form.wall_sheathing_reviewed,
    wind_girts_reviewed: form.wind_girts_reviewed,
    approved: form.inspection_status === "Approved",
    not_approved: form.inspection_status === "Not Approved",
    reinspection_required: form.inspection_status === "Reinspection Required"

  }
}

function saveAsPDF(form){

  const pathToPDF = 'pdf/' + form.form_id + '.pdf';

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
      const result = template(data);
      const html = result;
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
  generatePdf().then(r => form.pdf_url = pathToPDF);
  console.log("path: " + form.pdf_url);

}
