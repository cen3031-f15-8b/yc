'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workout Result Schema
 */

 var WorkoutResultSchema = new Schema({
 	workout: {
        type: Schema.ObjectId,
        ref: 'Workout'
	},
	user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	result: {
		type: Number
	},
    timestamp: {
        type: Date,
        default: Date.now
    }
 });


mongoose.model('WorkoutResult', WorkoutResultSchema);
