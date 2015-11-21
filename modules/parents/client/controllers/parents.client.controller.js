'use strict';

// Parents controller
angular.module('parents').controller('ParentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parents',
	function($scope, $stateParams, $location, Authentication, Parents ) {
		$scope.authentication = Authentication;
		$scope.children = Authentication.user.children;

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

		// Initialize Google Maps
		$scope.initializeGoogleMaps = function() {
			// Calculate the average latitude/longitude
			var defaultCenter = true;
			var sumLat = 0;
			var sumLong = 0;
			var locationsCount = 0;
			for (var i = 0; i < $scope.children.length; i++) {
				var lastKnownLocation = $scope.children[i].lastKnownLocation;

				if (lastKnownLocation) {
					defaultCenter = false;
					sumLat += lastKnownLocation.latitude;
					sumLong += lastKnownLocation.longitude;
					locationsCount += 1;
				}
			}

			// Set the center latitude/longitude
			var centerLatLong;
			if (defaultCenter) {
				// Center the map to downtown Gainesville, FL
				centerLatLong = new google.maps.LatLng(29.651954, -82.325005);
			} else {
				var avgLat = sumLat / locationsCount;
				var avgLong = sumLong / locationsCount;
				centerLatLong = new google.maps.LatLng(avgLat, avgLong);
			}

			// Initialize map
			var mapCanvas = document.getElementById('map');
			var mapOptions = {
				center: centerLatLong,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var map = new google.maps.Map(mapCanvas, mapOptions);

			// Set Google Maps markers
			for (var i = 0; i < $scope.children.length; i++) {
				var lastKnownLocation = $scope.children[i].lastKnownLocation;

				if (lastKnownLocation) {
					var newLat = lastKnownLocation.latitude;
					var newLong = lastKnownLocation.longitude;
					var latLong = {lat: newLat, lng: newLong};
					var marker = new google.maps.Marker({
						position: latLong,
						title: "child.displayName"
					});

					// To add the marker to the map, call setMap();
					marker.setMap(map);
				}
			}
		}

		// Call initializeGoogleMaps function
		google.maps.event.addDomListener(window, 'load', $scope.initializeGoogleMaps());
	}
]);
