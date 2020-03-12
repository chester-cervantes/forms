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
    default: '',
    required: 'Please fill project id',
    trim: true
  },
  dev_company_name: {
    type: String,
    default: '',
    required: 'Please fill developer company',
    trim: true
  },
  project_location: {
    type: String,
    default: '',
    required: 'Please fill in project address',
    trim: true
  },
  contractor_company: {
    type: String,
    default: '',
    required: 'Please fill contractor company',
    trim: true
  },
  report_date_time: {
    type: Date,
    default: Date.now,
    required: 'Please fill contractor company',
  },
  weather: {
    type: [ String ],
    enum : [ 'Thunderstorm' , 'Drizzle' , 'Rain' , 'Snow' , 'Mist' , 'Smoke' , 'Haze' , 'Dust' , 'Fog' , 'Sand' , 'Ash' , 'Squall' , 'Tornado' , 'Clear' , 'Clouds' ],
    default: '',
    required: "Please fill weather info"
  },
  temperature: {
    type: Number,
    default: '',
    required: "Please fill temperature (celsius) info"
  },
  footings_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },
  foundation_walls_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },
  sheathing_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },
  sheathing_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },  
  framing_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },
  other_review_type: {
    type: Boolean,
    default: false,
    required: ""
  },
  other_review_type_description: {
    type: String,
    default: '',
    required: "Please fill review type(s)",
    trim: true
  },
  rebar_pos_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  rebar_pos_instructions: {
    type: String,
    default: 'None',
    required: "Please fill",
    trim: true
  },
  rebar_size_spacing_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  rebar_size_spacing_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  anchorage_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  anchorage_reviewed_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  form_plan_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  form_plan_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  conformance_spec_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  conformance_spec_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  conformance_drawing_reviewed: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  conformance_drawing_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  beam_girder_bearing_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  beam_girder_bearing_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  continuity_top_plate_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  continuity_top_plate_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  lintel_open_reviewed: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  lintel_open_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  shearwalls_fastening_holddowns_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  shearwalls_fastening_holddowns_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  continuity_tall_walls_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  continuity_tall_walls_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  blocking_floor_system_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  blocking_floor_system_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  wall_sheathing_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  wall_sheathing_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  wind_girts_reviewed: {
    type: Boolean,
    default: false,
    required: "Please fill"
  },
  wind_girts_instructions: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  observation: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  comments: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  inspection_status: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  },
  inspector_name: {
    type: String,
    default: '',
    required: "Please fill",
    trim: true
  }
});

mongoose.model('Form', FormSchema);
