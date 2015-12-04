'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Plan Schema
 */
var PlanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Plan name',
		trim: true
	},
	duration: {
		type: Number,
		default: 1,
		min: 1,
		required: 'Please enter the duration of the plan in weeks',
		numberOfDaysPerWeek: {
			type: [Number]
		}
	},
	workouts: [{
		type: Schema.ObjectId,
		ref: 'Workout'
	}],
	category: {
		type: String,
		enum: ['Whole Body', 'Upper Body', 'Lower Body'],
		required: 'Please enter plan category'
	},
	rating: {  
		type: Number,
		default: 0
	},
	timesCompleted: {
		type: Number,
		default: 0
	}
});

mongoose.model('Plan', PlanSchema);