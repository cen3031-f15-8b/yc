'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	UserFeed = mongoose.model('UserFeed'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a User feed
 */
exports.create = function(req, res) {
	var userFeed = new UserFeed(req.body);
	userFeed.user = req.user;

	userFeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userFeed);
		}
	});
};

/**
 * Show the current User feed
 */
exports.read = function(req, res) {
	res.jsonp(req.userFeed);
};

/**
 * Update a User feed
 */
exports.update = function(req, res) {
	var userFeed = req.userFeed ;

	userFeed = _.extend(userFeed , req.body);

	userFeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userFeed);
		}
	});
};

/**
 * Delete an User feed
 */
exports.delete = function(req, res) {
	var userFeed = req.userFeed ;

	userFeed.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userFeed);
		}
	});
};

/**
 * List of User feeds
 */
exports.list = function(req, res) { UserFeed.find().sort('-created').populate('user', 'displayName').exec(function(err, userFeeds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userFeeds);
		}
	});
};

/**
 * User feed middleware
 */
exports.userFeedByID = function(req, res, next, id) { UserFeed.findById(id).populate('user', 'displayName').exec(function(err, userFeed) {
		if (err) return next(err);
		if (! userFeed) return next(new Error('Failed to load User feed ' + id));
		req.userFeed = userFeed ;
		next();
	});
};