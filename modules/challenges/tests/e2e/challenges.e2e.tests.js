'use strict';

describe('Challenges E2E Tests:', function() {
	describe('Test Challenges page', function() {
		xit('Should not include new Challenges', function() {
			browser.get('http://localhost:3000/#!/challenges');
			expect(element.all(by.repeater('challenge in challenges')).count()).toEqual(0);
		});
	});
});
