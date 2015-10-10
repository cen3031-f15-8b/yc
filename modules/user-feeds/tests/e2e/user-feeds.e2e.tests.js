'use strict';

describe('User feeds E2E Tests:', function() {
	describe('Test User feeds page', function() {
		it('Should not include new User feeds', function() {
			browser.get('http://localhost:3000/#!/user-feeds');
			expect(element.all(by.repeater('userFeed in userFeeds')).count()).toEqual(0);
		});
	});
});
