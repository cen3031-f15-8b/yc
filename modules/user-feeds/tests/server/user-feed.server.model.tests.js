'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserFeed = mongoose.model('UserFeed');

/**
 * Globals
 */
var user, userFeed;

/**
 * Unit tests
 */
describe('User feed Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			userFeed = new UserFeed({
				name: 'User feed Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return userFeed.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			userFeed.name = '';

			return userFeed.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UserFeed.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
