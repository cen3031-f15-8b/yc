'use strict';

// Protractor configuration

// some configuration options came from <https://masteringmean.com/lessons/733-Configuring-Protractor-for-E2E-Testing>
exports.config = {
	//seleniumAddress: 'http://localhost:4444/wd/hub',
	baseUrl: 'http://localhost:' + (process.env.PORT || '3001'),
	specs: [
		//'modules/*/tests/e2e/*.js'
		'modules/parents/tests/e2e/*.js',
		'modules/users/tests/e2e/*.js',
		'modules/user-feeds/tests/e2e/*.js'
	]
};