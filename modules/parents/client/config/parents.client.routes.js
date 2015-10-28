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
		state('parents.list', {
			url: '',
			templateUrl: 'modules/parents/views/list-parents.client.view.html'
		}).
		state('parents.create', {
			url: '/create',
			templateUrl: 'modules/parents/views/create-parent.client.view.html'
		}).
		state('parents.view', {
			url: '/:parentId',
			templateUrl: 'modules/parents/views/view-parent.client.view.html'
		}).
		state('parents.edit', {
			url: '/:parentId/edit',
			templateUrl: 'modules/parents/views/edit-parent.client.view.html'
		});
	}
]);