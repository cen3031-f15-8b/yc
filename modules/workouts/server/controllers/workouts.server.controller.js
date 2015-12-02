'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Workout = mongoose.model('Workout'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Workout
 */
exports.create = function(req, res) {
	var workout = new Workout(req.body);

	workout.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workout);
		}
	});
};

/**
 * Show the current Workout
 */
exports.read = function(req, res) {
	res.jsonp(req.workout);
};

/**
 * Update a Workout
 */
exports.update = function(req, res) {
	var workout = req.workout ;

	workout = _.extend(workout , req.body);

	workout.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workout);
		}
	});
};

/**
 * Delete an Workout
 */
exports.delete = function(req, res) {
	var workout = req.workout ;

	workout.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workout);
		}
	});
};

/**
 * List of Workouts
 */
exports.list = function(req, res) { Workout.find().sort('-created').populate().exec(function(err, workouts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workouts);
		}
	});
};

/**
 * Workout middleware
 */
exports.workoutByID = function(req, res, next, id) { Workout.findById(id).exec(function(err, workout) {
		if (err) return next(err);
		if (! workout) return next(new Error('Failed to load Workout ' + id));
		req.workout = workout ;
		next();
	});
};

/**
 * Store workout rating
 */
exports.storeRating = function(req, res) {
	var workout = req.workout;

	if (req.body.difficulty === undefined || req.body.rating === undefined) {
		return res.status(400).send({
			message: 'Invalid request to storeRating: missing difficulty or rating field'
		});
	}

	workout.difficulty = ((workout.difficulty * workout.timesCompleted) + req.body.difficulty) / (workout.timesCompleted + 1);
	workout.rating = ((workout.rating * workout.timesCompleted) + req.body.rating) / (workout.timesCompleted + 1);
	workout.timesCompleted += 1;

	workout.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.status(200).send({
				message: 'Rating submitted successfully!'
			});
		}
	});
};
