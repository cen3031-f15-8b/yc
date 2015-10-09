'use strict';

module.exports = function(app) {
	var userFeeds = require('../controllers/user-feeds.server.controller');
	var userFeedsPolicy = require('../policies/user-feeds.server.policy');

	// User feeds Routes
	app.route('/api/user-feeds').all()
		.get(userFeeds.list).all(userFeedsPolicy.isAllowed)
		.post(userFeeds.create);

	app.route('/api/user-feeds/:userFeedId').all(userFeedsPolicy.isAllowed)
		.get(userFeeds.read)
		.put(userFeeds.update)
		.delete(userFeeds.delete);

	// Finish by binding the User feed middleware
	app.param('userFeedId', userFeeds.userFeedByID);
};