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
	});
});
