'use strict';

describe('Parents E2E Tests:', function() {
	describe('Test Parents page', function() {
		it('Should be able to sign up as a parent and add a child', function() {
			browser.get('/authentication/signup');
			element(by.model('credentials.firstName')).sendKeys('Test');
			element(by.model('credentials.lastName')).sendKeys('Parent');
			element(by.model('credentials.email')).sendKeys('nobody@example.com');
			element(by.model('credentials.username')).sendKeys('testparent2');
			element(by.model('credentials.password')).sendKeys('parent123!');
			element(by.buttonText('Sign up')).click();

			expect(element.all(by.repeater('child in children')).count()).toBe(0);


			browser.get('/settings/addchild');
			element(by.model('credentials.firstName')).sendKeys('Test');
			element(by.model('credentials.lastName')).sendKeys('Child1');
			element(by.model('credentials.age')).sendKeys('7');
			element(by.model('credentials.username')).sendKeys('testparentchild3');
			element(by.model('credentials.password')).sendKeys('parent123!');
			element(by.buttonText('Add child')).click();
			expect(element(by.binding('success')).getText()).toEqual('Added a child!');

			browser.get('/');
			expect(element.all(by.repeater('child in children')).count()).toBe(1);
		});

		afterEach(function(){
			browser.get('/api/auth/signout');
		});
	});
});
