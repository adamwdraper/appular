/*
 * Test Config Settings
 */
var allTestFiles = [],
    TESTS_REGEXP = /tests\.js$/,
    pathToModule = function(path) {
        return path.replace(/^\/base\//, '').replace(/\.js$/, '');
    };

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TESTS_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

requirejs.config({
    waitSeconds: 0,
    baseUrl: '/base',
    config: {
        'appular': {
            env: 'test',
            useFixtures: true
        }
    },
    paths: {
        'appular': 'libraries/appular/appular',
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/extensions/functions',
        'underscore': 'libraries/underscore/underscore',
        'underscoreTemplate': 'libraries/underscore/extensions/template',
        'backbone': 'libraries/backbone/backbone',
        'backboneStickit': 'libraries/backbone/extensions/stickit',
        'moment': 'libraries/moment/moment',
        'numeral': 'libraries/numeral/numeral',
        'domReady': 'libraries/require/plugins/domReady',
        'template': 'libraries/require/plugins/template',
        'text': 'libraries/require/plugins/text'
    },
    deps: [
        'appular',
        'jqueryFunctions',
        'underscoreTemplate',
        'backboneStickit'
    ].concat(allTestFiles),
    callback: window.__karma__.start
});