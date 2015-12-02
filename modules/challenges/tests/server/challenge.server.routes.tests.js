'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Challenge = mongoose.model('Challenge'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, challenge;

/**
 * Challenge routes tests
 */
xdescribe('Challenge CRUD tests', function() {
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

		// Save a user to the test db and create new Challenge
		user.save(function() {
			challenge = {
				name: 'Challenge Name'
			};

			done();
		});
	});

	it('should be able to save Challenge instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Challenge
				agent.post('/api/challenges')
					.send(challenge)
					.expect(200)
					.end(function(challengeSaveErr, challengeSaveRes) {
						// Handle Challenge save error
						if (challengeSaveErr) done(challengeSaveErr);

						// Get a list of Challenges
						agent.get('/api/challenges')
							.end(function(challengesGetErr, challengesGetRes) {
								// Handle Challenge save error
								if (challengesGetErr) done(challengesGetErr);

								// Get Challenges list
								var challenges = challengesGetRes.body;

								// Set assertions
								(challenges[0].user._id).should.equal(userId);
								(challenges[0].name).should.match('Challenge Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Challenge instance if not logged in', function(done) {
		agent.post('/api/challenges')
			.send(challenge)
			.expect(403)
			.end(function(challengeSaveErr, challengeSaveRes) {
				// Call the assertion callback
				done(challengeSaveErr);
			});
	});

	it('should not be able to save Challenge instance if no name is provided', function(done) {
		// Invalidate name field
		challenge.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Challenge
				agent.post('/api/challenges')
					.send(challenge)
					.expect(400)
					.end(function(challengeSaveErr, challengeSaveRes) {
						// Set message assertion
						(challengeSaveRes.body.message).should.match('Please fill Challenge name');
						
						// Handle Challenge save error
						done(challengeSaveErr);
					});
			});
	});

	it('should be able to update Challenge instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Challenge
				agent.post('/api/challenges')
					.send(challenge)
					.expect(200)
					.end(function(challengeSaveErr, challengeSaveRes) {
						// Handle Challenge save error
						if (challengeSaveErr) done(challengeSaveErr);

						// Update Challenge name
						challenge.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Challenge
						agent.put('/api/challenges/' + challengeSaveRes.body._id)
							.send(challenge)
							.expect(200)
							.end(function(challengeUpdateErr, challengeUpdateRes) {
								// Handle Challenge update error
								if (challengeUpdateErr) done(challengeUpdateErr);

								// Set assertions
								(challengeUpdateRes.body._id).should.equal(challengeSaveRes.body._id);
								(challengeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Challenges if not signed in', function(done) {
		// Create new Challenge model instance
		var challengeObj = new Challenge(challenge);

		// Save the Challenge
		challengeObj.save(function() {
			// Request Challenges
			request(app).get('/api/challenges')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Challenge if not signed in', function(done) {
		// Create new Challenge model instance
		var challengeObj = new Challenge(challenge);

		// Save the Challenge
		challengeObj.save(function() {
			request(app).get('/api/challenges/' + challengeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', challenge.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Challenge instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Challenge
				agent.post('/api/challenges')
					.send(challenge)
					.expect(200)
					.end(function(challengeSaveErr, challengeSaveRes) {
						// Handle Challenge save error
						if (challengeSaveErr) done(challengeSaveErr);

						// Delete existing Challenge
						agent.delete('/api/challenges/' + challengeSaveRes.body._id)
							.send(challenge)
							.expect(200)
							.end(function(challengeDeleteErr, challengeDeleteRes) {
								// Handle Challenge error error
								if (challengeDeleteErr) done(challengeDeleteErr);

								// Set assertions
								(challengeDeleteRes.body._id).should.equal(challengeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Challenge instance if not signed in', function(done) {
		// Set Challenge user 
		challenge.user = user;

		// Create new Challenge model instance
		var challengeObj = new Challenge(challenge);

		// Save the Challenge
		challengeObj.save(function() {
			// Try deleting Challenge
			request(app).delete('/api/challenges/' + challengeObj._id)
			.expect(403)
			.end(function(challengeDeleteErr, challengeDeleteRes) {
				// Set message assertion
				(challengeDeleteRes.body.message).should.match('User is not authorized');

				// Handle Challenge error error
				done(challengeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Challenge.remove().exec(function(){
				done();
			});
		});
	});
});
