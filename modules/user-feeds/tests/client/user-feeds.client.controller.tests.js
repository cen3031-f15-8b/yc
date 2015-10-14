'use strict';

(function() {
	// User feeds Controller Spec
	describe('User feeds Controller Tests', function() {
		// Initialize global variables
		var UserFeedsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the User feeds controller.
			UserFeedsController = $controller('UserFeedsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User feed object fetched from XHR', inject(function(UserFeeds) {
			// Create sample User feed using the User feeds service
			var sampleUserFeed = new UserFeeds({
				name: 'New User feed'
			});

			// Create a sample User feeds array that includes the new User feed
			var sampleUserFeeds = [sampleUserFeed];

			// Set GET response
			$httpBackend.expectGET('api/user-feeds').respond(sampleUserFeeds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userFeeds).toEqualData(sampleUserFeeds);
		}));

		it('$scope.findOne() should create an array with one User feed object fetched from XHR using a userFeedId URL parameter', inject(function(UserFeeds) {
			// Define a sample User feed object
			var sampleUserFeed = new UserFeeds({
				name: 'New User feed'
			});

			// Set the URL parameter
			$stateParams.userFeedId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/user-feeds\/([0-9a-fA-F]{24})$/).respond(sampleUserFeed);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userFeed).toEqualData(sampleUserFeed);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserFeeds) {
			// Create a sample User feed object
			var sampleUserFeedPostData = new UserFeeds({
				name: 'New User feed'
			});

			// Create a sample User feed response
			var sampleUserFeedResponse = new UserFeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New User feed'
			});

			// Fixture mock form input values
			scope.name = 'New User feed';

			// Set POST response
			$httpBackend.expectPOST('api/user-feeds', sampleUserFeedPostData).respond(sampleUserFeedResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the User feed was created
			expect($location.path()).toBe('/user-feeds/' + sampleUserFeedResponse._id);
		}));

		it('$scope.update() should update a valid User feed', inject(function(UserFeeds) {
			// Define a sample User feed put data
			var sampleUserFeedPutData = new UserFeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New User feed'
			});

			// Mock User feed in scope
			scope.userFeed = sampleUserFeedPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/user-feeds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-feeds/' + sampleUserFeedPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userFeedId and remove the User feed from the scope', inject(function(UserFeeds) {
			// Create new User feed object
			var sampleUserFeed = new UserFeeds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User feeds array and include the User feed
			scope.userFeeds = [sampleUserFeed];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/user-feeds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserFeed);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userFeeds.length).toBe(0);
		}));
	});
}());