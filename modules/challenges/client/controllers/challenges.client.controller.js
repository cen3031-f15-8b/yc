'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges',
	function($scope, $stateParams, $location, Authentication, Challenges ) {
		$scope.authentication = Authentication;

		// Create new Challenge
		$scope.create = function() {
			// Create new Challenge object
			var challenge = new Challenges ({
				name: this.name
			});

			// Redirect after save
			challenge.$save(function(response) {
				$location.path('challenges/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Challenge
		$scope.remove = function( challenge ) {
			if ( challenge ) { challenge.$remove();

				for (var i in $scope.challenges ) {
					if ($scope.challenges [i] === challenge ) {
						$scope.challenges.splice(i, 1);
					}
				}
			} else {
				$scope.challenge.$remove(function() {
					$location.path('challenges');
				});
			}
		};

		// Update existing Challenge
		$scope.update = function() {
			var challenge = $scope.challenge ;

			challenge.$update(function() {
				$location.path('challenges/' + challenge._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Challenges
		$scope.find = function() {
			$scope.challenges = Challenges.query();
		};

		// Find existing Challenge
		$scope.findOne = function() {
			$scope.challenge = Challenges.get({ 
				challengeId: $stateParams.challengeId
			});
		};
	}
]);