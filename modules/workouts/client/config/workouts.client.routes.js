'use strict';

//Setting up route
angular.module('workouts').config(['$stateProvider',
	function($stateProvider) {
		// Workouts state routing
		$stateProvider.
		state('workouts', {
			abstract: true,
			url: '/workouts',
			template: '<ui-view/>'
		}).
		state('workouts.list', {
			url: '',
			templateUrl: 'modules/workouts/views/list-workouts.client.view.html'
		}).
		state('workouts.create', {
			url: '/create',
			templateUrl: 'modules/workouts/views/create-workout.client.view.html'
		}).
		state('workouts.view', {
			url: '/:workoutId',
			templateUrl: 'modules/workouts/views/view-workout.client.view.html'
		}).
		state('workouts.upper-body-workout', {
			url: '/category/upper-body',
			templateUrl: 'modules/workouts/views/upper-body-workout.client.view.html'
		}).
		state('workouts.lower-body-workout', {
			url: '/category/lower-body',
			templateUrl: 'modules/workouts/views/lower-body-workout.client.view.html'
		}).
		state('workouts.whole-body-workout', {
			url: '/category/whole-body',
			templateUrl: 'modules/workouts/views/whole-body-workout.client.view.html'
		}).
		state('workouts.edit', {
			url: '/:workoutId/edit',
			templateUrl: 'modules/workouts/views/edit-workout.client.view.html'
		});
	}
]);