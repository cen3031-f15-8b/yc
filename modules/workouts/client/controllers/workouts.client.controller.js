'use strict';

// Workouts controller
angular.module('workouts').controller('WorkoutsController', ['$scope', '$window', '$http', '$stateParams', '$location', 'Users', 'Authentication', 'Workouts', '$timeout',
	function($scope, $window, $http, $stateParams, $location, Users, Authentication, Workouts, $timeout ) {
		$scope.authentication = Authentication;

		$scope.check = false;
		$scope.counter = 2;
		$scope.tCounter1 = 12;
		$scope.tCounter2 = 0;
		$scope.go = 'GO!';
		var stopped;

		$scope.toggleCustom = function(){
		if( $scope.counter > 0 ){
			$scope.check = true;
			$scope.cdstring = ':' + $scope.counter;
			$timeout(function(){
				console.log( $scope.cdstring);
				$scope.counter--;
				$scope.toggleCustom();
			}, 1000);
		}
		else
		{
			$scope.cdstring = 'GO!';
			$timeout(function(){
				console.log($scope.cdstring);}, 1000);
			$timeout(function(){
				$scope.counter = 2;
				$scope.check = false;
				$scope.timer();
			}, 1000);
		}
	};

		$scope.timer = function(){
			if( $scope.tCounter2 > 0 ){
				$scope.check = true;
				if($scope.tCounter2 < 10) {
					$scope.cdstring = $scope.tCounter1 + ':' + '0' + $scope.tCounter2;
				}
				else {
					$scope.cdstring = $scope.tCounter1 + ':' + $scope.tCounter2;
				}
				$timeout(function(){
					console.log( $scope.cdstring);
					$scope.tCounter2--;
					$scope.timer();
				}, 1000);
			}
			else if( $scope.tCounter1 > 0 ){
				$scope.check = true;
				$scope.cdstring = $scope.tCounter1 + ':' + '00';
				$timeout(function(){
					console.log( $scope.cdstring);
					$scope.tCounter1--;
					$scope.tCounter2 = 59;
					$scope.timer();
				}, 1000);
			}
			else
			{
				$scope.cdstring = 'DONE';
				$timeout(function(){
					console.log($scope.cdstring);}, 1000);
				$timeout(function(){
					$scope.tCounter1 = 12;
					$scope.tCounter2 = 0;
					$scope.check = false;}, 1000);
			}
		};



		// Create new Workout
		$scope.create = function() {
			// Create new Workout object
			var workout = new Workouts ({
				name: this.name
			});

			// Redirect after save
			workout.$save(function(response) {
				$location.path('workouts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workout
		$scope.remove = function( workout ) {
			if ( workout ) { workout.$remove();

				for (var i in $scope.workouts ) {
					if ($scope.workouts [i] === workout ) {
						$scope.workouts.splice(i, 1);
					}
				}
			} else {
				$scope.workout.$remove(function() {
					$location.path('workouts');
				});
			}
		};

		// Update existing Workout
		$scope.update = function() {
			var workout = $scope.workout ;

			workout.$update(function() {
				$location.path('workouts/' + workout._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workouts
		$scope.find = function() {
			$scope.workouts = Workouts.query();
		};

		// Find existing Workout
		$scope.findOne = function() {
			$scope.workout = Workouts.get({
				workoutId: $stateParams.workoutId
			});
		};

		// Get current location
		$window.navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			$scope.position = position;

			$scope.updateLocation();
		});

		$scope.updateLocation = function() {
			console.log("location = ");
			console.log($scope.position);

			$http.post('/api/auth/location', $scope.position).success(function(response) {
				$scope.successMsg = response.message;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

	}


]);
