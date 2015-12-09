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

exports.getResults = function(req, res) {
	console.log(req.query);
	var numResults = 20; // default to 20 results at max
	if (req.query.numResults) {
		numResults = Number(req.query.numResults); // or let user specify with numResults parameter
	}

	var query = WorkoutResult
				.find({'workout': req.workout._id})
				.populate('user')
				.select('user result')
				.sort('-result');

	query.exec(function(error, results){
		var filtered = _.map(results, function(r){
			return {
				username: r.user.username,
				result: r.result
			}
		});

		var unique = _.uniq(filtered,
				function(item){
					return item.username;
				}
		);

		var limited = _.take(unique, numResults);
		return res.jsonp(limited);
	});

};
