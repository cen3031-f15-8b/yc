'use strict';

(function() {
	// Parents Controller Spec
	xdescribe('Parents Controller Tests', function() {
		// Initialize global variables
		var ParentsController,
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

			// Initialize the Parents controller.
			ParentsController = $controller('ParentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Parent object fetched from XHR', inject(function(Parents) {
			// Create sample Parent using the Parents service
			var sampleParent = new Parents({
				name: 'New Parent'
			});

			// Create a sample Parents array that includes the new Parent
			var sampleParents = [sampleParent];

			// Set GET response
			$httpBackend.expectGET('api/parents').respond(sampleParents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parents).toEqualData(sampleParents);
		}));

		it('$scope.findOne() should create an array with one Parent object fetched from XHR using a parentId URL parameter', inject(function(Parents) {
			// Define a sample Parent object
			var sampleParent = new Parents({
				name: 'New Parent'
			});

			// Set the URL parameter
			$stateParams.parentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/parents\/([0-9a-fA-F]{24})$/).respond(sampleParent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parent).toEqualData(sampleParent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Parents) {
			// Create a sample Parent object
			var sampleParentPostData = new Parents({
				name: 'New Parent'
			});

			// Create a sample Parent response
			var sampleParentResponse = new Parents({
				_id: '525cf20451979dea2c000001',
				name: 'New Parent'
			});

			// Fixture mock form input values
			scope.name = 'New Parent';

			// Set POST response
			$httpBackend.expectPOST('api/parents', sampleParentPostData).respond(sampleParentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Parent was created
			expect($location.path()).toBe('/parents/' + sampleParentResponse._id);
		}));

		it('$scope.update() should update a valid Parent', inject(function(Parents) {
			// Define a sample Parent put data
			var sampleParentPutData = new Parents({
				_id: '525cf20451979dea2c000001',
				name: 'New Parent'
			});

			// Mock Parent in scope
			scope.parent = sampleParentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/parents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/parents/' + sampleParentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid parentId and remove the Parent from the scope', inject(function(Parents) {
			// Create new Parent object
			var sampleParent = new Parents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Parents array and include the Parent
			scope.parents = [sampleParent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/parents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleParent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.parents.length).toBe(0);
		}));
	});
}());
