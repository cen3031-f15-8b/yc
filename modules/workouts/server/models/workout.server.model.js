'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workout Schema
 */
var WorkoutSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Workout name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Workout', WorkoutSchema);