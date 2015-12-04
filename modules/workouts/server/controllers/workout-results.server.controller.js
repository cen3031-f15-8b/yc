'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	WorkoutResult = mongoose.model('WorkoutResult'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Workout Result
 */
exports.create = function(req, res) {
	var workoutResult = new WorkoutResult(req.body);

	workoutResult.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workoutResult);
		}
	});
};
