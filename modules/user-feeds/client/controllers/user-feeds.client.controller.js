'use strict';

// User feeds controller
angular.module('user-feeds').controller('UserFeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserFeeds',
	function($scope, $stateParams, $location, Authentication, UserFeeds ) {
		$scope.authentication = Authentication;

		// Create new User feed
		$scope.create = function() {
			// Create new User feed object
			var userFeed = new UserFeeds ({
				name: this.name
			});

			// Redirect after save
			userFeed.$save(function(response) {
				$location.path('user-feeds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User feed
		$scope.remove = function( userFeed ) {
			if ( userFeed ) { userFeed.$remove();

				for (var i in $scope.userFeeds ) {
					if ($scope.userFeeds [i] === userFeed ) {
						$scope.userFeeds.splice(i, 1);
					}
				}
			} else {
				$scope.userFeed.$remove(function() {
					$location.path('user-feeds');
				});
			}
		};

		// Update existing User feed
		$scope.update = function() {
			var userFeed = $scope.userFeed ;

			userFeed.$update(function() {
				$location.path('user-feeds/' + userFeed._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User feeds
		$scope.find = function() {
			$scope.userFeeds = UserFeeds.query();
		};

		// Find existing User feed
		$scope.findOne = function() {
			$scope.userFeed = UserFeeds.get({ 
				userFeedId: $stateParams.userFeedId
			});
		};
	}
]);