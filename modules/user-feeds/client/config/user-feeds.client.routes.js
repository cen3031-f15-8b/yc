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
		state('user-feeds.home', {
			url: '',
			templateUrl: 'modules/user-feeds/views/user-feeds-home.client.view.html'
		}).
		state('user-feeds.lib', {
			url: '/lib',
			templateUrl: 'modules/user-feeds/views/workout-library.client.view.html'
		}).
		state('user-feeds.prev', {
			url: '/prev-plan',
			templateUrl: 'modules/user-feeds/views/previous-plan.client.view.html'
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