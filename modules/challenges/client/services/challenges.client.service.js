'use strict';

//Challenges service used to communicate Challenges REST endpoints
angular.module('challenges').factory('Challenges', ['$resource',
	function($resource) {
		return $resource('api/challenges/:challengeId', { challengeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);