'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Plan = mongoose.model('Plan'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Plan
 */
exports.create = function(req, res) {
	var plan = new Plan(req.body);
	plan.user = req.user;

	plan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plan);
		}
	});
};

/**
 * Show the current Plan
 */
exports.read = function(req, res) {
	res.jsonp(req.plan);
};

/**
 * Update a Plan
 */
exports.update = function(req, res) {
	var plan = req.plan ;

	plan = _.extend(plan , req.body);

	plan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plan);
		}
	});
};

/**
 * Delete an Plan
 */
exports.delete = function(req, res) {
	var plan = req.plan ;

	plan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plan);
		}
	});
};

/**
 * List of Plans
 */
exports.list = function(req, res) { Plan.find().sort('-created').populate('user', 'displayName').exec(function(err, plans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plans);
		}
	});
};

/**
 * Plan middleware
 */
exports.planByID = function(req, res, next, id) { Plan.findById(id).populate('user', 'displayName').exec(function(err, plan) {
		if (err) return next(err);
		if (! plan) return next(new Error('Failed to load Plan ' + id));
		req.plan = plan ;
		next();
	});
};