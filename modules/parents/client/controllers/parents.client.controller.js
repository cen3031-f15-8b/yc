'use strict';

// Parents controller
angular.module('parents').controller('ParentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parents',
	function($scope, $stateParams, $location, Authentication, Parents ) {
		$scope.authentication = Authentication;

		// Create new Parent
		$scope.create = function() {
			// Create new Parent object
			var parent = new Parents ({
				name: this.name
			});

			// Redirect after save
			parent.$save(function(response) {
				$location.path('parents/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Parent
		$scope.remove = function( parent ) {
			if ( parent ) { parent.$remove();

				for (var i in $scope.parents ) {
					if ($scope.parents [i] === parent ) {
						$scope.parents.splice(i, 1);
					}
				}
			} else {
				$scope.parent.$remove(function() {
					$location.path('parents');
				});
			}
		};

		// Update existing Parent
		$scope.update = function() {
			var parent = $scope.parent ;

			parent.$update(function() {
				$location.path('parents/' + parent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Parents
		$scope.find = function() {
			$scope.parents = Parents.query();
		};

		// Find existing Parent
		$scope.findOne = function() {
			$scope.parent = Parents.get({ 
				parentId: $stateParams.parentId
			});
		};
	}
]);