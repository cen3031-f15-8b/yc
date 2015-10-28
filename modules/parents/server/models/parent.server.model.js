'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Parent Schema
 */
var ParentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Parent name',
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

mongoose.model('Parent', ParentSchema);