'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.redirect = function () {
			// If the user is signed in, redirect them to their User Feed.
	    if ($scope.authentication.user) {
				$location.url('/user-feeds');
			}
			// Else, if the user is not signed in, redirect them to the sign-in page.
			else {
				$location.url('/authentication/signin');
			}
		};
		// Trigger the
		$scope.redirect();
	}
]);
