'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Challenge = mongoose.model('Challenge'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Challenge
 */
exports.create = function(req, res) {
	var challenge = new Challenge(req.body);
	challenge.user = req.user;

	challenge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(challenge);
		}
	});
};

/**
 * Show the current Challenge
 */
exports.read = function(req, res) {
	res.jsonp(req.challenge);
};

/**
 * Update a Challenge
 */
exports.update = function(req, res) {
	var challenge = req.challenge ;

	challenge = _.extend(challenge , req.body);

	challenge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(challenge);
		}
	});
};

/**
 * Delete an Challenge
 */
exports.delete = function(req, res) {
	var challenge = req.challenge ;

	challenge.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(challenge);
		}
	});
};

/**
 * List of Challenges
 */
exports.list = function(req, res) { Challenge.find().sort('-created').populate('user', 'displayName').exec(function(err, challenges) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(challenges);
		}
	});
};

/**
 * Challenge middleware
 */
exports.challengeByID = function(req, res, next, id) { Challenge.findById(id).populate('user', 'displayName').exec(function(err, challenge) {
		if (err) return next(err);
		if (! challenge) return next(new Error('Failed to load Challenge ' + id));
		req.challenge = challenge ;
		next();
	});
};