'use strict';

describe('Parents E2E Tests:', function() {
	describe('Test Parents page', function() {
		it('Should not include new Parents', function() {
			browser.get('http://localhost:3000/#!/parents');
			expect(element.all(by.repeater('parent in parents')).count()).toEqual(0);
		});
	});
});
