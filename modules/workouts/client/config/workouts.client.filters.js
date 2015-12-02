'use strict';

angular.module('workouts').filter('timeshort', function () {
    return function (seconds) {
        return sprintf('%d:%02d', Math.floor(seconds / 60), (seconds % 60));
    };

});

angular.module('workouts').filter('timelong', function () {
        return function (sec) {
            if (sec < 1) {
                return 'ERROR: Invalid time';
            }
            var minutes = Math.floor(sec / 60);
            var seconds = sec % 60;

            if (minutes === 0) {
                if (seconds === 1) {
                    return seconds.toString() + ' second';
                } else {
                    return seconds.toString() + ' seconds';
                }
            } else if (minutes === 1) {
                if (seconds === 1) {
                    return minutes.toString() + ' minute, ' + seconds.toString() + ' second';
                } else {
                    return minutes.toString() + ' minute, ' + seconds.toString() + ' seconds';
                }
            } else {
                if (seconds === 1) {
                    return minutes.toString() + ' minutes, ' + seconds.toString() + ' second';
                } else {
                    return minutes.toString() + ' minutes, ' + seconds.toString() + ' seconds';
                }
            }
        };
    }
);
