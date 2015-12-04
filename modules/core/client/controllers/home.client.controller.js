'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', '$window',
	function($scope, Authentication, $location, $window) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.redirect = function () {
			if ($scope.authentication.user) {
				// If the user is signed in, redirect them to their User Feed.
		    if ($scope.authentication.user.roles[0] === 'child') {
					$location.url('/user-feeds');
				}
				else if ($scope.authentication.user.roles[0] === 'parent') {
					$location.url('/parents');
				}
			}
			// Else, if the user is not signed in, redirect them to the sign-in page.
			else {
				$location.url('/authentication/signin');
			}
		};
		// Trigger the redirect logic
		$scope.redirect();
	}
]);
