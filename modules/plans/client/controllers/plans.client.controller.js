'use strict';

// Plans controller
angular.module('plans').controller('PlansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plans', 'Workouts',
	function($scope, $stateParams, $location, Authentication, Plans, Workouts) {
		$scope.authentication = Authentication;
		$scope.workout_id = '564f8ca4095addac5fe9b99e';

		// Create new Plan
		$scope.create = function() {
			// Create new Plan object
			var plan = new Plans ({
				name: this.name
			});

			// Redirect after save
			plan.$save(function(response) {
				$location.path('plans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Plan
		$scope.remove = function( plan ) {
			if ( plan ) { plan.$remove();

				for (var i in $scope.plans ) {
					if ($scope.plans [i] === plan ) {
						$scope.plans.splice(i, 1);
					}
				}
			} else {
				$scope.plan.$remove(function() {
					$location.path('plans');
				});
			}
		};

		// Update existing Plan
		$scope.update = function() {
			var plan = $scope.plan ;

			plan.$update(function() {
				$location.path('plans/' + plan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workouts
		$scope.findWorkout = function() {
			$scope.workouts = Workouts.query();
		};

		// Find existing Workout
		$scope.findOneWorkout = function() {
			$scope.workout = Workouts.get({
				workoutId: $scope.workout_id
			});
		};

		// Find existing Plan
		$scope.findOne = function() {
			$scope.plan = Plans.get({ 
				planId: $stateParams.planId
			});
		};
	}
]);