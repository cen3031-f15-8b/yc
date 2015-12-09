'use strict';

describe('Plans E2E Tests:', function() {
	describe('Test Plans page', function() {

		beforeEach(function() {
			browser.get('/plans');
		});

		it('should go to Whole Body Plans', function(){
			element(by.id('whole_body_plans')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/plans/whole-body');
		});
		it('should go to Upper Body Plans', function(){
			element(by.id('upper_body_plans')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/plans/upper-body');
		});
		it('should go to Lower Body Plans', function(){
			element(by.id('lower_body_plans')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/plans/lower-body');
		});


	});
});
