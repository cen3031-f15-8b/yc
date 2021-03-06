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
			// For future reference, :
			// 		Latitude:		lastKnownLocation.coordinates[1]
			// 		Longitude:	lastKnownLocation.coordinates[0]
			var lastKnownLocation, i; // silence "variable is already defined" jshint

			// Calculate the average latitude/longitude
			var defaultCenter = true;
			var sumLat = 0;
			var sumLong = 0;
			var locationsCount = 0;
			for (i = 0; i < $scope.children.length; i++) {
				lastKnownLocation = $scope.children[i].lastKnownLocation;

				if (lastKnownLocation.valid) {
					defaultCenter = false;
					sumLat += lastKnownLocation.coordinates[1];
					sumLong += lastKnownLocation.coordinates[0];
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
			};
			var map = new google.maps.Map(mapCanvas, mapOptions);

			// Set Google Maps markers
			for (i = 0; i < $scope.children.length; i++) {
				lastKnownLocation = $scope.children[i].lastKnownLocation;

				if (lastKnownLocation.valid) {
					var newLat = lastKnownLocation.coordinates[1];
					var newLong = lastKnownLocation.coordinates[0];
					var latLong = {lat: newLat, lng: newLong};

					var timestamp = new Date(lastKnownLocation.timestamp);

					// Create an info window that will pop up when a marker is clicked
					var infowindowContent = '<b>' + $scope.children[i].displayName + '</b>' +
					'<br/>Last online on ' + timestamp.toLocaleString();

					var infowindow = new google.maps.InfoWindow({
						content: infowindowContent
					});

					// Create marker with the data from above
					var marker = new google.maps.Marker({
						position: latLong,
						title: $scope.children[i].displayName,
						infowindow: infowindow
					});

					google.maps.event.addListener(marker, 'click', function() {
						this.infowindow.open(map, this);
					});

					// To add the marker to the map, call setMap();
					marker.setMap(map);
				}
			}
		};

		// Call initializeGoogleMaps function
		google.maps.event.addDomListener(window, 'load', $scope.initializeGoogleMaps());
	}
]);
