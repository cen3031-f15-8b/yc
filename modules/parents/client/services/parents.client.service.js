'use strict';

//Parents service used to communicate Parents REST endpoints
angular.module('parents').factory('Parents', ['$resource',
	function($resource) {
		return $resource('api/parents/:parentId', { parentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);