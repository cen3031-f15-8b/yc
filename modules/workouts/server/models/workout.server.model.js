'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workout Schema
 */
/*Adrian's Code Starts Here */

var WorkoutSchema = new Schema({
    name: {
        type: String,
        required: 'Please give workout name',
        trim: true
    },
    equipment: {
        type: [String]
    },
    exercises: {
        type: [String]
    },
    seconds: {
        type: Number,
        required: 'Please enter workout duration in seconds'
    },
    type: {
        type: String,
        enum: ['AMRAP', 'RFT'],
        required: 'Please enter workout type: AMRAP or RFT'
    },
    difficulty: {
        type: Number,
        required: 'Please enter workout difficulty between 1 and 5',
        min: 1,
        max: 5
    },
    rating: {
        type: Number
    },
    timesCompleted: {
        type: Number,
        default: 0  // be sure to add 1 when calculating difficulty and rating to avoid div by zero and take into account the initial difficulty
    }
});

 /*Adrian's Code End Here */

mongoose.model('Workout', WorkoutSchema);
