'use strict';

//User feeds service used to communicate User feeds REST endpoints
angular.module('user-feeds').factory('UserFeeds', ['$resource',
	function($resource) {
		return $resource('api/user-feeds/:userFeedId', { userFeedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);