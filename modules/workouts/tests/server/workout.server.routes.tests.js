'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Workout = mongoose.model('Workout'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, workout;

/**
 * Workout routes tests
 */
describe('Workout CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Workout
		user.save(function() {
			workout = {
				name: 'Workout Name'
			};

			done();
		});
	});

	it('should be able to save Workout instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workout
				agent.post('/api/workouts')
					.send(workout)
					.expect(200)
					.end(function(workoutSaveErr, workoutSaveRes) {
						// Handle Workout save error
						if (workoutSaveErr) done(workoutSaveErr);

						// Get a list of Workouts
						agent.get('/api/workouts')
							.end(function(workoutsGetErr, workoutsGetRes) {
								// Handle Workout save error
								if (workoutsGetErr) done(workoutsGetErr);

								// Get Workouts list
								var workouts = workoutsGetRes.body;

								// Set assertions
								(workouts[0].user._id).should.equal(userId);
								(workouts[0].name).should.match('Workout Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Workout instance if not logged in', function(done) {
		agent.post('/api/workouts')
			.send(workout)
			.expect(403)
			.end(function(workoutSaveErr, workoutSaveRes) {
				// Call the assertion callback
				done(workoutSaveErr);
			});
	});

	it('should not be able to save Workout instance if no name is provided', function(done) {
		// Invalidate name field
		workout.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workout
				agent.post('/api/workouts')
					.send(workout)
					.expect(400)
					.end(function(workoutSaveErr, workoutSaveRes) {
						// Set message assertion
						(workoutSaveRes.body.message).should.match('Please fill Workout name');
						
						// Handle Workout save error
						done(workoutSaveErr);
					});
			});
	});

	it('should be able to update Workout instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workout
				agent.post('/api/workouts')
					.send(workout)
					.expect(200)
					.end(function(workoutSaveErr, workoutSaveRes) {
						// Handle Workout save error
						if (workoutSaveErr) done(workoutSaveErr);

						// Update Workout name
						workout.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Workout
						agent.put('/api/workouts/' + workoutSaveRes.body._id)
							.send(workout)
							.expect(200)
							.end(function(workoutUpdateErr, workoutUpdateRes) {
								// Handle Workout update error
								if (workoutUpdateErr) done(workoutUpdateErr);

								// Set assertions
								(workoutUpdateRes.body._id).should.equal(workoutSaveRes.body._id);
								(workoutUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Workouts if not signed in', function(done) {
		// Create new Workout model instance
		var workoutObj = new Workout(workout);

		// Save the Workout
		workoutObj.save(function() {
			// Request Workouts
			request(app).get('/api/workouts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Workout if not signed in', function(done) {
		// Create new Workout model instance
		var workoutObj = new Workout(workout);

		// Save the Workout
		workoutObj.save(function() {
			request(app).get('/api/workouts/' + workoutObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', workout.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Workout instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workout
				agent.post('/api/workouts')
					.send(workout)
					.expect(200)
					.end(function(workoutSaveErr, workoutSaveRes) {
						// Handle Workout save error
						if (workoutSaveErr) done(workoutSaveErr);

						// Delete existing Workout
						agent.delete('/api/workouts/' + workoutSaveRes.body._id)
							.send(workout)
							.expect(200)
							.end(function(workoutDeleteErr, workoutDeleteRes) {
								// Handle Workout error error
								if (workoutDeleteErr) done(workoutDeleteErr);

								// Set assertions
								(workoutDeleteRes.body._id).should.equal(workoutSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Workout instance if not signed in', function(done) {
		// Set Workout user 
		workout.user = user;

		// Create new Workout model instance
		var workoutObj = new Workout(workout);

		// Save the Workout
		workoutObj.save(function() {
			// Try deleting Workout
			request(app).delete('/api/workouts/' + workoutObj._id)
			.expect(403)
			.end(function(workoutDeleteErr, workoutDeleteRes) {
				// Set message assertion
				(workoutDeleteRes.body.message).should.match('User is not authorized');

				// Handle Workout error error
				done(workoutDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Workout.remove().exec(function(){
				done();
			});
		});
	});
});
