'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.redirect = function () {
			// If the user is signed in, redirect them to their User Feed.
	    if ($scope.authentication.user) {
				window.location.href = "/user-feeds";
			}
			// Else, if the user is not signed in, redirect them to the sign-in page.
			else {
				window.location.href = "/authentication/signin";
			}
		};
		// Trigger the
		$scope.redirect();
	}
]);
