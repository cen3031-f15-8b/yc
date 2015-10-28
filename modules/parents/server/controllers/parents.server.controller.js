'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Parent = mongoose.model('Parent'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Parent
 */
exports.create = function(req, res) {
	var parent = new Parent(req.body);
	parent.user = req.user;

	parent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parent);
		}
	});
};

/**
 * Show the current Parent
 */
exports.read = function(req, res) {
	res.jsonp(req.parent);
};

/**
 * Update a Parent
 */
exports.update = function(req, res) {
	var parent = req.parent ;

	parent = _.extend(parent , req.body);

	parent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parent);
		}
	});
};

/**
 * Delete an Parent
 */
exports.delete = function(req, res) {
	var parent = req.parent ;

	parent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parent);
		}
	});
};

/**
 * List of Parents
 */
exports.list = function(req, res) { Parent.find().sort('-created').populate('user', 'displayName').exec(function(err, parents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parents);
		}
	});
};

/**
 * Parent middleware
 */
exports.parentByID = function(req, res, next, id) { Parent.findById(id).populate('user', 'displayName').exec(function(err, parent) {
		if (err) return next(err);
		if (! parent) return next(new Error('Failed to load Parent ' + id));
		req.parent = parent ;
		next();
	});
};