'use strict';

//Plans service used to communicate Plans REST endpoints
angular.module('plans').factory('Plans', ['$resource',
	function($resource) {
		return $resource('api/plans/:planId', { planId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);