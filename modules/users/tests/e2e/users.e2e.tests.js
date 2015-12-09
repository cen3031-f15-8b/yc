'use strict';

describe('Users E2E Tests:', function() {
	describe('Signin Validation', function() {
		it('Should report missing credentials', function() {
			browser.get('/authentication/signin');
			element(by.buttonText('Login')).click();
			element(by.binding('error')).getText().then(function(errorText) {
				expect(errorText).toBe('Missing credentials');
			});
		});


		it('Should log in successfully', function(){
			element(by.id('username')).sendKeys('testparentchild3');
			element(by.id('password')).sendKeys('parent123!');
			element(by.buttonText('Login')).click();
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/user-feeds');
		});
	});
});
