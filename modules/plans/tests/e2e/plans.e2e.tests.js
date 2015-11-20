'use strict';

describe('Plans E2E Tests:', function() {
	describe('Test Plans page', function() {
		xit('Should not include new Plans', function() {
			browser.get('http://localhost:3000/#!/plans');
			expect(element.all(by.repeater('plan in plans')).count()).toEqual(0);
		});
	});
});
