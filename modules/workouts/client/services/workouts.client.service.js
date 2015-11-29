'use strict';

//Workouts service used to communicate Workouts REST endpoints
angular.module('workouts').factory('Workouts', ['$resource',
	function($resource) {
		return $resource('api/workouts/:workoutId', { workoutId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('workouts').factory('WorkoutResults', ['$resource',
	function($resource) {
		return $resource('api/workouts/results/:workoutResultId', { workoutResultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
