'use strict';

// Configuring the User feeds module
angular.module('user-feeds').run(['Menus',
	function(Menus) {
		// Add the User feeds dropdown item
		Menus.addMenuItem('topbar', {
			title: 'User feeds',
			state: 'user-feeds',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'user-feeds', {
			title: 'List User feeds',
			state: 'user-feeds.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'user-feeds', {
			title: 'Create User feed',
			state: 'user-feeds.create'
		});
	}
]);