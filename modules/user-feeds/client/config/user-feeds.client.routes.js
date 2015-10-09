'use strict';

//Setting up route
angular.module('user-feeds').config(['$stateProvider',
	function($stateProvider) {
		// User feeds state routing
		$stateProvider.
		state('user-feeds', {
			abstract: true,
			url: '/user-feeds',
			template: '<ui-view/>'
		}).
		state('user-feeds.list', {
			url: '',
			templateUrl: 'modules/user-feeds/views/list-user-feeds.client.view.html'
		}).
		state('user-feeds.create', {
			url: '/create',
			templateUrl: 'modules/user-feeds/views/create-user-feed.client.view.html'
		}).
		state('user-feeds.view', {
			url: '/:userFeedId',
			templateUrl: 'modules/user-feeds/views/view-user-feed.client.view.html'
		}).
		state('user-feeds.edit', {
			url: '/:userFeedId/edit',
			templateUrl: 'modules/user-feeds/views/edit-user-feed.client.view.html'
		});
	}
]);