'use strict';

(function() {
	// Challenges Controller Spec
	xdescribe('Challenges Controller Tests', function() {
		// Initialize global variables
		var ChallengesController,
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

			// Initialize the Challenges controller.
			ChallengesController = $controller('ChallengesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Challenge object fetched from XHR', inject(function(Challenges) {
			// Create sample Challenge using the Challenges service
			var sampleChallenge = new Challenges({
				name: 'New Challenge'
			});

			// Create a sample Challenges array that includes the new Challenge
			var sampleChallenges = [sampleChallenge];

			// Set GET response
			$httpBackend.expectGET('api/challenges').respond(sampleChallenges);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.challenges).toEqualData(sampleChallenges);
		}));

		it('$scope.findOne() should create an array with one Challenge object fetched from XHR using a challengeId URL parameter', inject(function(Challenges) {
			// Define a sample Challenge object
			var sampleChallenge = new Challenges({
				name: 'New Challenge'
			});

			// Set the URL parameter
			$stateParams.challengeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(sampleChallenge);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.challenge).toEqualData(sampleChallenge);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Challenges) {
			// Create a sample Challenge object
			var sampleChallengePostData = new Challenges({
				name: 'New Challenge'
			});

			// Create a sample Challenge response
			var sampleChallengeResponse = new Challenges({
				_id: '525cf20451979dea2c000001',
				name: 'New Challenge'
			});

			// Fixture mock form input values
			scope.name = 'New Challenge';

			// Set POST response
			$httpBackend.expectPOST('api/challenges', sampleChallengePostData).respond(sampleChallengeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Challenge was created
			expect($location.path()).toBe('/challenges/' + sampleChallengeResponse._id);
		}));

		it('$scope.update() should update a valid Challenge', inject(function(Challenges) {
			// Define a sample Challenge put data
			var sampleChallengePutData = new Challenges({
				_id: '525cf20451979dea2c000001',
				name: 'New Challenge'
			});

			// Mock Challenge in scope
			scope.challenge = sampleChallengePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/challenges\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/challenges/' + sampleChallengePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid challengeId and remove the Challenge from the scope', inject(function(Challenges) {
			// Create new Challenge object
			var sampleChallenge = new Challenges({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Challenges array and include the Challenge
			scope.challenges = [sampleChallenge];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChallenge);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.challenges.length).toBe(0);
		}));
	});
}());
