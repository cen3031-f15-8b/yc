'use strict';

//Setting up route
angular.module('challenges').config(['$stateProvider',
	function($stateProvider) {
		// Challenges state routing
		$stateProvider.
		state('challenges', {
			abstract: true,
			url: '/challenges',
			template: '<ui-view/>'
		}).
		state('challenges.list', {
			url: '',
			templateUrl: 'modules/challenges/views/list-challenges.client.view.html'
		}).
		state('challenges.create', {
			url: '/create',
			templateUrl: 'modules/challenges/views/create-challenge.client.view.html'
		}).
		state('challenges.view', {
			url: '/:challengeId',
			templateUrl: 'modules/challenges/views/view-challenge.client.view.html'
		}).
		state('challenges.edit', {
			url: '/:challengeId/edit',
			templateUrl: 'modules/challenges/views/edit-challenge.client.view.html'
		});
	}
]);