/*
 * Test Config Settings
 */
var allTestFiles = [],
    TESTS_REGEXP = /tests\.js$/,
    LIB_REGEXP = /libraries/,
    pathToModule = function(path) {
        return path.replace(/^\/base\//, '').replace(/\.js$/, '');
    };

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TESTS_REGEXP.test(file) && !LIB_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

requirejs.config({
    waitSeconds: 0,
    baseUrl: '/base',
    config: {
        'appular': {
            env: 'develop',
            useFixtures: true
        }
    },
    paths: {
        'appular': 'libraries/appular/appular',
        'modernizr': 'libraries/modernizr/modernizr',
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/extensions/functions',
        'underscore': 'libraries/underscore/underscore',
        'backbone': 'libraries/backbone/backbone',
        'backboneStickit': 'libraries/backbone/extensions/stickit',
        'domReady': 'libraries/require/plugins/domReady',
        'async': 'libraries/require/plugins/async',
        'json': 'libraries/require/plugins/json',
        'template': 'libraries/require/plugins/template',
        'text': 'libraries/require/plugins/text'
    },
    shim: {
        'modernizr': {
            exports: 'Modernizr'
        }
    },
    deps: [
        'appular',
        'jqueryFunctions',
        'backboneStickit'
    ].concat(allTestFiles),
    callback: window.__karma__.start
});