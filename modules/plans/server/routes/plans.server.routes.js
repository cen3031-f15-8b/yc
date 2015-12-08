'use strict';

module.exports = function(app) {
	var plans = require('../controllers/plans.server.controller');
	var plansPolicy = require('../policies/plans.server.policy');

	var workouts = require('../controllers/workouts.server.controller');

	// Plans Routes
	app.route('/api/plans').all()
		.get(plans.list).all()
		.post(plans.create);

	app.route('/api/plans/:planId').all()
		.get(plans.read)
		.put(plans.update)
		.delete(plans.delete);

	// Finish by binding the Plan middleware
	app.param('planId', plans.planByID);
	app.param('workoutId', workouts.workoutByID);
	app.param('workoutName', workouts.workoutByName);

};