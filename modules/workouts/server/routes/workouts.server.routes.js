'use strict';

module.exports = function(app) {
	var workouts = require('../controllers/workouts.server.controller');
	var workoutsPolicy = require('../policies/workouts.server.policy');

	var workoutResults = require('../controllers/workout-results.server.controller');

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

	app.route('/api/workouts/category/:workoutCategory').all()
		.get(workouts.workoutByCategory);

	// Finish by binding the Workout middleware
	app.param('workoutId', workouts.workoutByID);
	app.param('workoutCategory', workouts.workoutByCategoryMiddleware);
};
