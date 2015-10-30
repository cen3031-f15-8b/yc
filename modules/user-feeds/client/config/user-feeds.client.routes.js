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
			url: '/lib/prev-plan',
			templateUrl: 'modules/user-feeds/views/previous-plan.client.view.html'
		}).
		state('user-feeds.category-plan', {
			url: '/lib/category',
			templateUrl: 'modules/user-feeds/views/category-plan-user-feed.client.view.html'
		}).
		state('user-feeds.whole-body-plan', {
			url: '/lib/category/whole-body',
			templateUrl: 'modules/user-feeds/views/whole-body-plans.client.view.html'
		}).
		state('user-feeds.single-workout', {
			url: '/lib/single-workout',
			templateUrl: 'modules/user-feeds/views/single-workout.client.view.html'
		}).
		state('user-feeds.category-workout', {
			url: '/lib/single-workout/category',
			templateUrl: 'modules/user-feeds/views/single-workout-category.client.view.html'
		}).
		state('user-feeds.whole-body-workout', {
			url: '/lib/single-workout/category/whole-body',
			templateUrl: 'modules/user-feeds/views/whole-body-workouts.client.view.html'
		}).
		state('user-feeds.todays-workout', {
			url: '/lib/single-workout/todays-workout',
			templateUrl: 'module/user-feeds/views/todays-workout.client.view.html'
		}).
		state('workout', {
			url: '/workout',
			templateUrl: 'modules/workouts/views/list-workouts.client.view.html'
		});
	}
]);
