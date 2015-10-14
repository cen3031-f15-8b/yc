'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User feed Schema
 */
var UserFeedSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill User feed name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('UserFeed', UserFeedSchema);