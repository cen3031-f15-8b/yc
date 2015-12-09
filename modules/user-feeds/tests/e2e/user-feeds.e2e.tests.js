'use strict';

describe('User feeds E2E Tests:', function() {
	describe('Test User feeds page', function() {



  	browser.get('/user-feeds');
		//browser.pause(3002);
		it('should go to Workout Library', function(){
			element(by.id('workout_library')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/user-feeds/lib');
		});



		it('should go to Categories', function(){
			//browser.pause(3003);
			element(by.id('categories')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/plans');
		});

		it('should go to Single Workout', function(){
			browser.get('/user-feeds/lib');
			element(by.id('single_workouts')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/user-feeds/lib/single-workout');
		});
		/*it('should go to Previous Plan', function(){
			element(by.id('previous_plan')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/user-feeds/lib');
		});*/

	});
});
