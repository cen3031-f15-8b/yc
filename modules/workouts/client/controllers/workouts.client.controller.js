'use strict';

// Workouts controller
angular.module('workouts').controller('WorkoutsController', ['$scope', '$window', '$http', '$location', '$state', '$stateParams', '$timeout', 'Authentication', 'Users', 'WorkoutResults', 'Workouts',
	function($scope, $window, $http, $location, $state, $stateParams, $timeout, Authentication, Users, WorkoutResults, Workouts) {
		$scope.authentication = Authentication;
		$scope._ = _;

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
					$scope.difficulty = 0;
					$scope.rating = 0;
				},
				onstart: function(event, from, to){
					$scope.timerFSM.countdownCounter = 10;
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

		$scope.timerFSM.countdownCounter = 10; // TODO: make these dynamic
		$scope.timerFSM.counter = 60;
		$scope.timerFSM.intervalHandle = undefined;
		$scope.lastequipment = '';
		$scope.lastexercise = '';

		// Get current location
		$window.navigator.geolocation.getCurrentPosition(function(position) {

			$scope.position = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				timestamp: position.timestamp
			};

			$scope.updateLocation();
		});

		$scope.updateLocation = function() {

			$http.post('/api/auth/location', $scope.position).success(function(response) { //FIXME: is this required? do we care about the response?
				$scope.successMsg = response.message;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.submitResult = function(){
			var result = new WorkoutResults({
				workout: $scope.workout._id,
				user: Authentication.user._id,
				result: $scope.result
			});

			result.$save(function(response){
				$http.post('/api/workouts/ratings/'+$scope.workout._id, {
					rating: $scope.rating,
					difficulty : $scope.difficulty
				}).success(function(response){
					$scope.result = undefined;
					$scope.findOne();
					$state.go('workouts.leaderboard', {
						workoutId: $stateParams.workoutId
					});
				}).error(function(response){
					// TODO/XXX: handle rating submission error
				});
			}, function(errorResponse){
				// TODO/XXX: handle workout result submission error
			});
		};

		$scope.clickDifficultyStar = function(star) {
			$scope.difficulty = star;
		};

		$scope.clickRatingStar = function(star) {
			$scope.rating = star;
		};

		//////////////////////////////////////////////////////////
		// Leaderboard functions
		/////////////////////////////////////////////////////////

		$scope.initializeLeaderboard = function(){
			$scope.workoutId = $stateParams.workoutId;
			$http.get('/api/workouts/results/'+$stateParams.workoutId)
					.success(function(response){
						$scope.leaderboardResults = response;
					});
		};

		//////////////////////////////////////////////////////////
		// CRUD functions
		/////////////////////////////////////////////////////////

		$scope.initializeCreateForm = function() {
			$scope.name = '';
			$scope.tempequipment = '';
			$scope.equipment = [''];
			$scope.exercises = [''];
			$scope.seconds = '';
			$scope.type = 'AMRAP';
			$scope.difficulty = '';
		};

		$scope.createFormAddEquipmentRow = function(item) {
			$scope.equipment.pop(); // remove last empty item
			$scope.equipment.push(item, ''); // add an extra empty item
			$scope.lastequipment = item;
		};

		$scope.createFormAddExerciseRow = function(item) {
			$scope.exercises.pop(); // remove last empty item
			$scope.exercises.push(item, ''); // add an extra empty item
			$scope.lastexercise = item;
		};

		$scope.createFormRemoveEquipmentRow = function(index) {
			$scope.equipment.splice(index, 1);
		};

		$scope.createFormRemoveExerciseRow = function(index) {
			$scope.exercises.splice(index, 1);
		};

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
			var workout = $scope.workout;

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
			$scope.timerFSM.counter = $scope.workout.seconds;
		};

	}


]);
