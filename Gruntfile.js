module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'js/dev/modules/**/*.js',
                'js/dev/plugins/**/*.js',
                'js/dev/utilities/**/*.js'
            ],
            options: {
                node: true,
                browser: true,
                curly: true,
                devel: false,
                eqeqeq: true,
                eqnull: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                globals: {
                    define: false
                },
                strict: false
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js/dev',
                    dir: 'js/build',
                    paths: {
                        'jqueryLib': 'empty:',
                        'jquery': 'libraries/jquery/jquery',
                        'jqueryFunctions': 'libraries/jquery/functions',
                        'underscoreLib': 'libraries/underscore/underscore-1.4.4',
                        'underscore': 'libraries/underscore/underscore',
                        'backboneLib': 'libraries/backbone/backbone-1.0.0',
                        'backbone': 'libraries/backbone/backbone',
                        'moment': 'empty:',
                        'numeral': 'empty:',
                        'domReady': 'libraries/require/plugins/domReady',
                        'async': 'libraries/require/plugins/async',
                        'json': 'libraries/require/plugins/json',
                        'text': 'libraries/require/plugins/text'
                    },
                    modules: [
                        {
                            name: 'appular',
                            include: [
                                'libraries/modernizr/modernizr',
                                'libraries/require/require',
                                'libraries/require/config-build',
                                'libraries/appular/appular',
                                'jquery',
                                'jqueryFunctions',
                                'underscore',
                                'backbone',
                                'domReady',
                                'text'
                            ]
                        },
                        {
                            name: 'modules/demo/module',
                            exclude: [
                                'appular'
                            ]
                        },
                        {
                            name: 'modules/user-bar/module',
                            exclude: [
                                'appular'
                            ]
                        }
                    ],
                    removeCombined: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('release', [
        'jshint',
        'requirejs'
    ]);

};