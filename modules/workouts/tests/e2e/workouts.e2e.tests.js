'use strict';

describe('Workouts E2E Tests:', function() {
	describe('Test Workouts page', function() {
		it('Should not include new Workouts', function() {
			browser.get('http://localhost:3000/#!/workouts');
			expect(element.all(by.repeater('workout in workouts')).count()).toEqual(0);
		});
	});
});
