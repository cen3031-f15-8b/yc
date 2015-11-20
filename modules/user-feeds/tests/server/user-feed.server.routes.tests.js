'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserFeed = mongoose.model('UserFeed'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, userFeed;

/**
 * User feed routes tests
 */
xdescribe('User feed CRUD tests', function() {
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

		// Save a user to the test db and create new User feed
		user.save(function() {
			userFeed = {
				name: 'User feed Name'
			};

			done();
		});
	});

	it('should be able to save User feed instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User feed
				agent.post('/api/user-feeds')
					.send(userFeed)
					.expect(200)
					.end(function(userFeedSaveErr, userFeedSaveRes) {
						// Handle User feed save error
						if (userFeedSaveErr) done(userFeedSaveErr);

						// Get a list of User feeds
						agent.get('/api/user-feeds')
							.end(function(userFeedsGetErr, userFeedsGetRes) {
								// Handle User feed save error
								if (userFeedsGetErr) done(userFeedsGetErr);

								// Get User feeds list
								var userFeeds = userFeedsGetRes.body;

								// Set assertions
								(userFeeds[0].user._id).should.equal(userId);
								(userFeeds[0].name).should.match('User feed Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User feed instance if not logged in', function(done) {
		agent.post('/api/user-feeds')
			.send(userFeed)
			.expect(403)
			.end(function(userFeedSaveErr, userFeedSaveRes) {
				// Call the assertion callback
				done(userFeedSaveErr);
			});
	});

	it('should not be able to save User feed instance if no name is provided', function(done) {
		// Invalidate name field
		userFeed.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User feed
				agent.post('/api/user-feeds')
					.send(userFeed)
					.expect(400)
					.end(function(userFeedSaveErr, userFeedSaveRes) {
						// Set message assertion
						(userFeedSaveRes.body.message).should.match('Please fill User feed name');
						
						// Handle User feed save error
						done(userFeedSaveErr);
					});
			});
	});

	it('should be able to update User feed instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User feed
				agent.post('/api/user-feeds')
					.send(userFeed)
					.expect(200)
					.end(function(userFeedSaveErr, userFeedSaveRes) {
						// Handle User feed save error
						if (userFeedSaveErr) done(userFeedSaveErr);

						// Update User feed name
						userFeed.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing User feed
						agent.put('/api/user-feeds/' + userFeedSaveRes.body._id)
							.send(userFeed)
							.expect(200)
							.end(function(userFeedUpdateErr, userFeedUpdateRes) {
								// Handle User feed update error
								if (userFeedUpdateErr) done(userFeedUpdateErr);

								// Set assertions
								(userFeedUpdateRes.body._id).should.equal(userFeedSaveRes.body._id);
								(userFeedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User feeds if not signed in', function(done) {
		// Create new User feed model instance
		var userFeedObj = new UserFeed(userFeed);

		// Save the User feed
		userFeedObj.save(function() {
			// Request User feeds
			request(app).get('/api/user-feeds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User feed if not signed in', function(done) {
		// Create new User feed model instance
		var userFeedObj = new UserFeed(userFeed);

		// Save the User feed
		userFeedObj.save(function() {
			request(app).get('/api/user-feeds/' + userFeedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', userFeed.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User feed instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User feed
				agent.post('/api/user-feeds')
					.send(userFeed)
					.expect(200)
					.end(function(userFeedSaveErr, userFeedSaveRes) {
						// Handle User feed save error
						if (userFeedSaveErr) done(userFeedSaveErr);

						// Delete existing User feed
						agent.delete('/api/user-feeds/' + userFeedSaveRes.body._id)
							.send(userFeed)
							.expect(200)
							.end(function(userFeedDeleteErr, userFeedDeleteRes) {
								// Handle User feed error error
								if (userFeedDeleteErr) done(userFeedDeleteErr);

								// Set assertions
								(userFeedDeleteRes.body._id).should.equal(userFeedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User feed instance if not signed in', function(done) {
		// Set User feed user 
		userFeed.user = user;

		// Create new User feed model instance
		var userFeedObj = new UserFeed(userFeed);

		// Save the User feed
		userFeedObj.save(function() {
			// Try deleting User feed
			request(app).delete('/api/user-feeds/' + userFeedObj._id)
			.expect(403)
			.end(function(userFeedDeleteErr, userFeedDeleteRes) {
				// Set message assertion
				(userFeedDeleteRes.body.message).should.match('User is not authorized');

				// Handle User feed error error
				done(userFeedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			UserFeed.remove().exec(function(){
				done();
			});
		});
	});
});
