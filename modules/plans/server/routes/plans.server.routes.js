'use strict';

module.exports = function(app) {
	var plans = require('../controllers/plans.server.controller');
	var plansPolicy = require('../policies/plans.server.policy');

	var workouts = require('../../../workouts/server/controllers/workouts.server.controller');

	// Plans Routes
	app.route('/api/plans').all()
		.get(plans.list).all()
		.post(plans.create);

	app.route('/api/plans/:planId').all()
		.get(plans.read)
		.put(plans.update)
		.delete(plans.delete);

	// Trying to facilitate fetching a plan by category
	app.route('/api/plans/category/:planCategory').all()
		.get(plans.planByCategory);

	// Finish by binding the Plan middleware
	app.param('planId', plans.planByID);
	app.param('planCategory', plans.planByCategoryMiddleware);

};
