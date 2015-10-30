'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Parent = mongoose.model('Parent'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, parent;

/**
 * Parent routes tests
 */
describe('Parent CRUD tests', function() {
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

		// Save a user to the test db and create new Parent
		user.save(function() {
			parent = {
				name: 'Parent Name'
			};

			done();
		});
	});

	it('should be able to save Parent instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parent
				agent.post('/api/parents')
					.send(parent)
					.expect(200)
					.end(function(parentSaveErr, parentSaveRes) {
						// Handle Parent save error
						if (parentSaveErr) done(parentSaveErr);

						// Get a list of Parents
						agent.get('/api/parents')
							.end(function(parentsGetErr, parentsGetRes) {
								// Handle Parent save error
								if (parentsGetErr) done(parentsGetErr);

								// Get Parents list
								var parents = parentsGetRes.body;

								// Set assertions
								(parents[0].user._id).should.equal(userId);
								(parents[0].name).should.match('Parent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Parent instance if not logged in', function(done) {
		agent.post('/api/parents')
			.send(parent)
			.expect(403)
			.end(function(parentSaveErr, parentSaveRes) {
				// Call the assertion callback
				done(parentSaveErr);
			});
	});

	it('should not be able to save Parent instance if no name is provided', function(done) {
		// Invalidate name field
		parent.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parent
				agent.post('/api/parents')
					.send(parent)
					.expect(400)
					.end(function(parentSaveErr, parentSaveRes) {
						// Set message assertion
						(parentSaveRes.body.message).should.match('Please fill Parent name');
						
						// Handle Parent save error
						done(parentSaveErr);
					});
			});
	});

	it('should be able to update Parent instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parent
				agent.post('/api/parents')
					.send(parent)
					.expect(200)
					.end(function(parentSaveErr, parentSaveRes) {
						// Handle Parent save error
						if (parentSaveErr) done(parentSaveErr);

						// Update Parent name
						parent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Parent
						agent.put('/api/parents/' + parentSaveRes.body._id)
							.send(parent)
							.expect(200)
							.end(function(parentUpdateErr, parentUpdateRes) {
								// Handle Parent update error
								if (parentUpdateErr) done(parentUpdateErr);

								// Set assertions
								(parentUpdateRes.body._id).should.equal(parentSaveRes.body._id);
								(parentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parents if not signed in', function(done) {
		// Create new Parent model instance
		var parentObj = new Parent(parent);

		// Save the Parent
		parentObj.save(function() {
			// Request Parents
			request(app).get('/api/parents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Parent if not signed in', function(done) {
		// Create new Parent model instance
		var parentObj = new Parent(parent);

		// Save the Parent
		parentObj.save(function() {
			request(app).get('/api/parents/' + parentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', parent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Parent instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parent
				agent.post('/api/parents')
					.send(parent)
					.expect(200)
					.end(function(parentSaveErr, parentSaveRes) {
						// Handle Parent save error
						if (parentSaveErr) done(parentSaveErr);

						// Delete existing Parent
						agent.delete('/api/parents/' + parentSaveRes.body._id)
							.send(parent)
							.expect(200)
							.end(function(parentDeleteErr, parentDeleteRes) {
								// Handle Parent error error
								if (parentDeleteErr) done(parentDeleteErr);

								// Set assertions
								(parentDeleteRes.body._id).should.equal(parentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Parent instance if not signed in', function(done) {
		// Set Parent user 
		parent.user = user;

		// Create new Parent model instance
		var parentObj = new Parent(parent);

		// Save the Parent
		parentObj.save(function() {
			// Try deleting Parent
			request(app).delete('/api/parents/' + parentObj._id)
			.expect(403)
			.end(function(parentDeleteErr, parentDeleteRes) {
				// Set message assertion
				(parentDeleteRes.body.message).should.match('User is not authorized');

				// Handle Parent error error
				done(parentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Parent.remove().exec(function(){
				done();
			});
		});
	});
});
