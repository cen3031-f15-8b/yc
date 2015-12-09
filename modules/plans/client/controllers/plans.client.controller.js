'use strict';

// Plans controller
angular.module('plans').controller('PlansController', ['$scope', '$stateParams', '$location', '$log','Authentication', 'Plans', 'Workouts',	
	function($scope, $stateParams, $location, $log, Authentication, Plans, Workouts) {
		$scope.authentication = Authentication;
		// $scope.workout_id = '564f8ca4095addac5fe9b99e';

		// user input 
		$scope.daysPerWeek = 0;
		$scope.tempDaysPerWeekArr = [];
		//$scope.tmpWorkoutName;
		//$scope.tmpWorkoutId;
		$scope.tempWorkoutsArr = [];
		$scope.totalWorkouts = 0;

		// Create new Plan
		$scope.create = function() {
			// Make an array for the number of workouts per week
			$scope.initializeNumberOfDaysPerWeek(this.duration);
			$scope.initializeWorkoutsArray(this.tmpWorkoutName, this.daysPerWeek);

			// Create new Plan object
			var plan = new Plans ({
				name: this.name,
				category: this.category,
				duration: this.duration,
				numberOfDaysPerWeek: $scope.tempDaysPerWeekArr,
				workouts: $scope.tempWorkoutsArr
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

		$scope.initializeNumberOfDaysPerWeek = function(tempdur, tempdays) {
			$scope.daysPerWeek = tempdays;
			for(var i = 0; i < tempdur; i++) {
				$scope.tempDaysPerWeekArr[i] = $scope.daysPerWeek;
			}
		};

		$scope.initializeWorkoutsArray = function(temp) {
			$scope.tmpWorkoutName = temp;
			$scope.tmpWorkoutId = Workouts.get({
				name: $scope.tmpWorkoutName
			}).workoutId;
			$scope.tempWorkoutsArr.push($scope.tmpWorkoutId);
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

		// Find existing Workout by ID
		$scope.findOneWorkoutById = function() {
			$scope.workout = Workouts.get({
				workoutId: $stateParams.workoutId
			});
		};

		// Find an existing Workout by name
		$scope.findOneWorkoutByName = function() {
			$scope.workout = Workouts.get({
				workoutId: $stateParams.workoutId
			});
		};

		// Find existing Plan
		$scope.findOne = function() {
			$scope.plan = Plans.get({ 
				planId: $stateParams.planId
			});
		};

		// Find all plans in database
		$scope.findAll = function() {
			$scope.plans = Plans.query();
		};

		// Find plans by category
		$scope.findByCategory = function(cat) {
			$scope.catplans = Plans.query({
				category: 'Whole Body'
			});
			console.log('Category = ' + cat);
			console.log('Plans = ' + Plans);
		};

		
		// $scope.items = [
  //   'The first choice!',
  //   'And another choice for you.',
  //   'but wait! A third!'
  // ];

  // $scope.status = {
  //   isopen: false
  // };

  // $scope.toggled = function(open) {
  //   $log.log('Dropdown is now: ', open);
  // };

  // $scope.toggleDropdown = function($event) {
  //   $event.preventDefault();
  //   $event.stopPropagation();
  //   $scope.status.isopen = !$scope.status.isopen;
  // };
}]);