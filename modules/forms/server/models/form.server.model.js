'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Form Schema
 */
var FormSchema = new Schema({
  form_id: {
    type: Number,
    //required: 'Please fill form id',
    trim: true
  },
  dev_company_name: {
    type: String,
    ////required: 'Please fill developer company',
    trim: true
  },
  project_location: {
    type: String,
    ////required: 'Please fill in project address',
    trim: true
  },
  contractor_company: {
    type: String,
    //required: 'Please fill contractor company',
    trim: true
  },
  report_date_time: {
    type: Date,
    //required: 'Please fill contractor company',
  },
  weather: {
    type: String,
    //required: "Please fill weather info"
  },
  temperature: {
    type: Number,
    //required: "Please fill temperature (celsius) info"
  },
  footings_review_type: {
    type: Boolean,
    default: false
  },
  foundation_walls_review_type: {
    type: Boolean,
    default: false
  },
  sheathing_review_type: {
    type: Boolean,
    default: false
  },
  sheathing_review_type: {
    type: Boolean,
    default: false
  },  
  framing_review_type: {
    type: Boolean,
    default: false
  },
  other_review_type: {
    type: Boolean,
    default: false
  },
  other_review_type_description: {
    type: String,
    default: 'None',
    trim: true
  },
  rebar_pos_reviewed: {
    type: Boolean,
    default: false
  },
  rebar_pos_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  rebar_size_spacing_reviewed: {
    type: Boolean,
    default: false
  },
  rebar_size_spacing_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  anchorage_reviewed: {
    type: Boolean,
    default: false
  },
  anchorage_reviewed_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  form_plan_reviewed: {
    type: Boolean,
    default: false
  },
  form_plan_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  conformance_spec_reviewed: {
    type: Boolean,
    default: false
  },
  conformance_spec_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  conformance_drawing_reviewed: {
    type: Boolean,
    default: false
  },
  conformance_drawing_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  beam_girder_bearing_reviewed: {
    type: Boolean,
    default: false
  },
  beam_girder_bearing_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  continuity_top_plate_reviewed: {
    type: Boolean,
    default: false
  },
  continuity_top_plate_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  lintel_open_reviewed: {
    type: Boolean,
    default: false
  },
  lintel_open_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  shearwalls_fastening_holddowns_reviewed: {
    type: Boolean,
    default: false
  },
  shearwalls_fastening_holddowns_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  continuity_tall_walls_reviewed: {
    type: Boolean,
    default: false
  },
  continuity_tall_walls_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  blocking_floor_system_reviewed: {
    type: Boolean,
    default: false
  },
  blocking_floor_system_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  wall_sheathing_reviewed: {
    type: Boolean,
    default: false
  },
  wall_sheathing_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  wind_girts_reviewed: {
    type: Boolean,
    default: false
  },
  wind_girts_instructions: {
    type: String,
    default: 'None',
    trim: true
  },
  observation: {
    type: String,
    default: 'None',
    trim: true
  },
  comments: {
    type: String,
    default: 'None',
    trim: true
  },
  inspection_status: {
    type: String,
    default: 'None.',
    trim: true
  },
  inspector_name: {
    type: String,
    //required: "Please fill inspector name",
    trim: true
  }
});

module.exports = mongoose.model('Form', FormSchema);
