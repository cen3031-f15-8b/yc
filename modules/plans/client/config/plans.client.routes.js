'use strict';

//Setting up route
angular.module('plans').config(['$stateProvider',
	function($stateProvider) {
		// Plans state routing
		$stateProvider.
		state('plans', {
			abstract: true,
			url: '/plans',
			template: '<ui-view/>'
		}).
		state('plans.list', {
			url: '',
			templateUrl: 'modules/plans/views/list-plans.client.view.html'
		}).
		state('plans.whole-body-plan', {
			url: '/whole-body',
			templateUrl: 'modules/plans/views/whole-body-plans.client.view.html'
		}).
		state('plans.upper-body-plan', {
			url: '/upper-body',
			templateUrl: 'modules/plans/views/upper-body-plans.client.view.html'
		}).
		state('plans.lower-body-plan', {
			url: '/lower-body',
			templateUrl: 'modules/plans/views/lower-body-plans.client.view.html'
		}).
		state('plans.category-plan', {
			url: '/category',
			templateUrl: 'modules/plans/views/category-plan.client.view.html'
		}).
		state('plans.create', {
			url: '/create',
			templateUrl: 'modules/plans/views/create-plan.client.view.html'
		}).
		state('plans.view', {
			url: '/:planId',
			templateUrl: 'modules/plans/views/view-plan.client.view.html'
		}).
		state('plans.edit', {
			url: '/:planId/edit',
			templateUrl: 'modules/plans/views/edit-plan.client.view.html'
		});

	}
]);
