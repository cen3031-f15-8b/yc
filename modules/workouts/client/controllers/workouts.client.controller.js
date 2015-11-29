'use strict';

// Workouts controller
angular.module('workouts').controller('WorkoutsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workouts', 'WorkoutResults', '$timeout', '$state', '$window',
	function($scope, $stateParams, $location, Authentication, Workouts, WorkoutResults, $timeout, $state, $window) {
		$scope.authentication = Authentication;

		$scope.convertSeconds = function(seconds){
			return sprintf('%d:%02d', Math.floor(seconds / 60), (seconds % 60));
		};

		$scope.timerFSM = StateMachine.create({
			// states: idle, countdown, running, finished
			//     start begins countdown, on countdown finish run main timer, can stop before end or will finish when complete time elapses
			initial: 'idle',
			events: [
				{name: 'start',  from: 'idle',      to: 'countdown'},
				{name: 'run',    from: 'countdown', to: 'running'},
				{name: 'cancel', from: 'running',   to: 'idle'},
				{name: 'finish', from: 'running',   to: 'finished'},
				{name: 'submit', from: 'finished',  to: 'idle'}
			],
			callbacks: {
				onenteridle: function(event, from, to) {
					$scope.starttxt = 'START';
				},
				onstart: function(event, from, to){
					$scope.timerFSM.countdownCounter = 2;
					$scope.timerFSM.counter = $scope.workout.seconds;
					$scope.gostring = $scope.convertSeconds($scope.timerFSM.countdownCounter--);
				},
				onentercountdown: function(event, from, to){
					$scope.timerFSM.intervalHandle = setInterval(function(){

						if ($scope.timerFSM.countdownCounter > 0) {
							$scope.gostring = $scope.convertSeconds($scope.timerFSM.countdownCounter);
						} else {
							$scope.gostring = 'GO!';
						}
						$scope.$apply();

						if ($scope.timerFSM.countdownCounter === -1) {
							clearInterval($scope.timerFSM.intervalHandle); // stop timer
							$scope.timerFSM.run();
						} else {
							$scope.timerFSM.countdownCounter--;
						}
					}, 1000);
				},
				onrun: function(event, from, to) {
					$scope.cdstring = $scope.convertSeconds($scope.timerFSM.counter--);
					$scope.$apply();
				},
				onenterrunning: function(event, from, to){
					$scope.timerFSM.intervalHandle = setInterval(function(){
						if ($scope.timerFSM.counter > 0) {
							$scope.cdstring = $scope.convertSeconds($scope.timerFSM.counter);
						} else {
							$scope.cdstring = 'DONE';
						}
						$scope.$apply();

						if ($scope.timerFSM.counter === -1) {
							$scope.timerFSM.finish();
						} else {
							$scope.timerFSM.counter--;
						}
					}, 1000);
				},
				onleaverunning: function(event, from, to) { // can leave running state via finishing or canceling
					clearInterval($scope.timerFSM.intervalHandle); // stop timer

				},
				onfinish: function(event, from, to) {
					$scope.$apply();
				}
			}
		});

		$scope.timerFSM.countdownCounter = 2; // TODO: make these dynamic
		$scope.timerFSM.counter = 60;
		$scope.timerFSM.intervalHandle = undefined;


		// Create new Workout
		$scope.create = function() {
			// Create new Workout object
			var workout = new Workouts({
				name: this.name,
				equipment: this.equipment,
				exercises: this.exercises,
				seconds: this.seconds,
				type: this.type,
				difficulty: this.difficulty
			});


			// Redirect after save
			workout.$save(function(response) {
				$location.path('workouts/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.equipment = '';
				$scope.exercises = '';
				$scope.minutes = '';
				$scope.seconds = '';
				$scope.type = '';
				$scope.difficulty = '';
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

			console.log(position);
		});

		$scope.submitResult = function(){
			var result = new WorkoutResults({
				workout: $scope.workout._id,
				user: Authentication.user._id,
				result: $scope.result
			});

			result.$save(function(response){
				$scope.result = undefined;
				$scope.timerFSM.submit();
			}, function(errorResponse){
				// TODO/XXX: handle error
			});
		};

	}


]);
