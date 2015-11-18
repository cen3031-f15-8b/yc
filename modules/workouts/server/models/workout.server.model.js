'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workout Schema
 */
/*Adrian's Code Starts Here */

 var WorkoutSchema = new Schema({
 	name: {
 		type: String,
 		required: 'Please give workout name',
 		trim: true
 	},
 	equipment: {
 		type: [String]
 	},
 	exercises: {
 		type: [String]
 	},
 	minutes: {
 		type: Number
 	},
 	seconds: {
 		type: Number
 	},
 	type: { 
 		type: String
 	},
 	difficulty: {
 		type: Number
 	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
 	
 });

 /*Adrian's Code End Here */

mongoose.model('Workout', WorkoutSchema);