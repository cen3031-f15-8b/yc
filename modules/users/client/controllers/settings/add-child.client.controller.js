'use strict';

angular.module('users').controller('AddChildController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.user = Authentication.user;

		$scope.addchild = function() {
			// clear messages on new attempt
			$scope.success = undefined;
			$scope.error = undefined;

			$http.post('/api/auth/signupchild', $scope.credentials).success(function(response) {
				$scope.success = response.message;
				$scope.credentials = undefined; // clear form on success
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
