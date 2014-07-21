// karma.js
module.exports = function(config) {
    config.set({
        frameworks: [
            'mocha',
            'requirejs',
            'chai',
            'sinon'
        ],
        files: [
            'libraries/require/configs/karma.js',
            {
                pattern: '**/*',
                included: false
            }
        ],
        exclude: [
            'build/**/*'
        ],
        reporters: [
            'mocha'
        ],
        browsers: [
            'Chrome',
            'Firefox'
        ]
    });
};