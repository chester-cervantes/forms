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
  project_id: {
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
  review_types_csv: {
    type: [ String ],
    default: '',
    required: "Please fill review type(s)"
  },
  rebar_pos: {
    type: String,
    default: '',
    required: "Please fill"
  },
  rebar_size_spacing: {
    type: String,
    default: '',
    required: "Please fill"
  },
  anchorage: {
    type: String,
    default: '',
    required: "Please fill"
  },
  form_plan: {
    type: String,
    default: '',
    required: "Please fill"
  },
  conformance_spec: {
    type: String,
    default: '',
    required: "Please fill"
  },
  conformance_drawing: {
    type: String,
    default: '',
    required: "Please fill"
  },
  beam_girder_bearing: {
    type: String,
    default: '',
    required: "Please fill"
  },
  continuity_top_plate: {
    type: String,
    default: '',
    required: "Please fill"
  },
  lintel_open: {
    type: String,
    default: '',
    required: "Please fill"
  },
  shearwalls_fastening_holddowns: {
    type: String,
    default: '',
    required: "Please fill"
  },
  continuity_tall_walls: {
    type: String,
    default: '',
    required: "Please fill"
  },
  blocking_floor_system: {
    type: String,
    default: '',
    required: "Please fill"
  },
  wall_sheathing: {
    type: String,
    default: '',
    required: "Please fill"
  },
  wind_girts: {
    type: String,
    default: '',
    required: "Please fill"
  },
  observation: {
    type: String,
    default: '',
    required: "Please fill"
  },
  inspection_status: {
    type: String,
    enum : [ 'Approved' , 'Not Approved' , 'Reinspection Required' ],
    default: '',
    required: "Please fill"
  },
  inspector_user_id: {
    type: Number,
    default: '',
    required: "Please fill"
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Form', FormSchema);
