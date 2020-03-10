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
    default: '',
    required: ""
  },
  foundation_walls_review_type: {
    type: Boolean,
    default: '',
    required: ""
  },
  sheathing_review_type: {
    type: Boolean,
    default: '',
    required: ""
  },
  sheathing_review_type: {
    type: Boolean,
    default: '',
    required: ""
  },  
  framing_review_type: {
    type: Boolean,
    default: '',
    required: ""
  },
  other_review_type: {
    type: Boolean,
    default: '',
    required: ""
  },
  other_review_type_description: {
    type: String,
    default: '',
    required: "Please fill review type(s)"
  },
  rebar_pos_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  rebar_pos_instructions: {
    type: String,
    default: 'None',
    required: "Please fill"
  },
  rebar_size_spacing_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  rebar_size_spacing_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  anchorage_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  anchorage_reviewed_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  form_plan_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  form_plan_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  conformance_spec_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  conformance_spec_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  conformance_drawing_reviewed: {
    type: String,
    default: '',
    required: "Please fill"
  },
  conformance_drawing_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  beam_girder_bearing_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  beam_girder_bearing_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  continuity_top_plate_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  continuity_top_plate_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  lintel_open_reviewed: {
    type: String,
    default: '',
    required: "Please fill"
  },
  lintel_open_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  shearwalls_fastening_holddowns_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  shearwalls_fastening_holddowns_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  continuity_tall_walls_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  continuity_tall_walls_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  blocking_floor_system_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  blocking_floor_system_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  wall_sheathing_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  wall_sheathing_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  wind_girts_reviewed: {
    type: Boolean,
    default: '',
    required: "Please fill"
  },
  wind_girts_instructions: {
    type: String,
    default: '',
    required: "Please fill"
  },
  observation: {
    type: String,
    default: '',
    required: "Please fill"
  },
  comments: {
    type: String,
    default: '',
    required: "Please fill"
  },
  inspection_status: {
    type: String,
    default: '',
    required: "Please fill"
  },
  inspector_name: {
    type: String,
    default: '',
    required: "Please fill"
  }
});

mongoose.model('Form', FormSchema);
