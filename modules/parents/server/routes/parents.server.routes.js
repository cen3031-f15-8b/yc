'use strict';

module.exports = function(app) {
	var parents = require('../controllers/parents.server.controller');
	var parentsPolicy = require('../policies/parents.server.policy');

	// Parents Routes
	app.route('/api/parents').all()
		.get(parents.list).all(parentsPolicy.isAllowed)
		.post(parents.create);

	app.route('/api/parents/:parentId').all(parentsPolicy.isAllowed)
		.get(parents.read)
		.put(parents.update)
		.delete(parents.delete);

	// Finish by binding the Parent middleware
	app.param('parentId', parents.parentByID);
};