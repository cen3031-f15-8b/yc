'use strict';

module.exports = function(app) {
	var workouts = require('../controllers/workouts.server.controller');
	var workoutsPolicy = require('../policies/workouts.server.policy');

	// Workouts Routes
	app.route('/api/workouts').all()
		.get(workouts.list).all()
		.post(workouts.create);

	app.route('/api/workouts/:workoutId').all()
		.get(workouts.read)
		.put(workouts.update)
		.delete(workouts.delete);

	// Finish by binding the Workout middleware
	app.param('workoutId', workouts.workoutByID);
};
