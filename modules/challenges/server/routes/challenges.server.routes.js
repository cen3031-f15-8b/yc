'use strict';

module.exports = function(app) {
	var challenges = require('../controllers/challenges.server.controller');
	var challengesPolicy = require('../policies/challenges.server.policy');

	// Challenges Routes
	app.route('/api/challenges').all()
		.get(challenges.list).all(challengesPolicy.isAllowed)
		.post(challenges.create);

	app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
		.get(challenges.read)
		.put(challenges.update)
		.delete(challenges.delete);

	// Finish by binding the Challenge middleware
	app.param('challengeId', challenges.challengeByID);
};