'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$window', '$location',
	function($scope, $state, Authentication, Menus, $window, $location) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
		
		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		//Go back to previous page
		$scope.goBack = function() {
			history.back();
		};

		$scope.reloadPage = function() {
			if($location.url() === '/user-feeds' || $location.url() === '/parents') {
				$window.location.reload();
			}
		};
	}
]);
