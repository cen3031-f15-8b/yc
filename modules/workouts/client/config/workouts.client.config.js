'use strict';

// Configuring the Workouts module
angular.module('workouts').run(['Menus',
	function(Menus) {
		// Add the Workouts dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Workouts',
		// 	state: 'workouts',
		// 	type: 'dropdown'
		// });

		// Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'workouts', {
		// 	title: 'List Workouts',
		// 	state: 'workouts.list'
		// });
	}
]);
