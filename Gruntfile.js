module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        docs: {
            build: {
                options: {
                    pretty: true
                },
                files: {
                    'js/dev/modules/docs/json/docs.json': [
                        'js/dev/**/*.js'
                    ]
                }
            }
        },
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
                noarg: true,
                sub: true,
                undef: true,
                globals: {
                    define: false,
                    requirejs: false
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
                        'modernizr': 'libraries/modernizr/modernizr-2.6.3',
                        'jquery': 'empty:',
                        'jqueryFunctions': 'libraries/jquery/extensions/functions',
                        'underscore': 'libraries/underscore/underscore-1.5.0',
                        'backbone': 'libraries/backbone/backbone-1.0.0',
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
                                'modernizr',
                                'libraries/modernizr/modernizr-2.6.3',
                                'libraries/require/require-2.1.9',
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
                        },
                        {
                            name: 'modules/docs/module',
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-appular-docs');

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('build', 'Builds hints and builds production JS, and builds js documentation json', [
        'jshint',
        'docs:build',
        'requirejs'
    ]);
};