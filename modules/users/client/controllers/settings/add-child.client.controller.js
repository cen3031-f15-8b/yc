'use strict';

angular.module('users').controller('AddChildController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.user = Authentication.user;

		$scope.addchild = function() {
			$http.post('/api/auth/signupchild', $scope.credentials).success(function(response) {
        
				$scope.successMsg = response.message;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
