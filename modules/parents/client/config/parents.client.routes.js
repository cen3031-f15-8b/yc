'use strict';

//Setting up route
angular.module('parents').config(['$stateProvider',
	function($stateProvider) {
		// Parents state routing
		$stateProvider.
		state('parents', {
			abstract: true,
			url: '/parents',
			template: '<ui-view/>'
		}).
		state('parents.parent-view', {
			url: '',
			templateUrl: 'modules/parents/views/parent-feed.client.view.html'
		}).
		state('parents.add-child', {
			url: '/addchild',
			templateUrl: 'modules/users/views/settings/add-child.client.view.html'
		});
	}
]);
