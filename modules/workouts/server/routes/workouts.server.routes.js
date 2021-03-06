'use strict';

module.exports = function(app) {
	var workouts = require('../controllers/workouts.server.controller');
	var workoutsPolicy = require('../policies/workouts.server.policy');

	var workoutResults = require('../controllers/workout-results.server.controller');

	app.route('/api/workouts/results/:workoutId')
		.get(workoutResults.getResults);

	app.route('/api/workouts/results')
		.post(workoutResults.create); // TODO: add more functions if necessary; currently only allows client to submit results -- is that all that's needed?

	app.route('/api/workouts/ratings/:workoutId')
		.post(workouts.storeRating);

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
