module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        open : {
            dev : {
                path: 'http://127.0.0.1:8888/'
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    noCache: true
                },
                files: {
                    'css/dev/style.css': 'scss/stylesheets/style.scss',
                    'css/dev/docs.css': 'scss/stylesheets/docs.scss'
                }
            },
            build: {
                options: {
                    style: 'compressed',
                    noCache: true
                },
                files: {
                    'css/build/style.css': 'scss/stylesheets/style.scss',
                    'css/build/docs.css': 'scss/stylesheets/docs.scss'
                }
            }
        },
        watch: {
            files: 'scss/**/*',
            tasks: [
                'sass:dev'
            ]
        },
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
                newcap: true,
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
                        'jqueryLib': 'empty:',
                        'jquery': 'libraries/jquery/jquery',
                        'jqueryFunctions': 'libraries/jquery/functions',
                        'zeptoLib': 'empty:',
                        'zepto': 'libraries/zepto/zepto',
                        'zeptoFunctions': 'libraries/zepto/functions',
                        'underscoreLib': 'libraries/underscore/underscore-1.5.1',
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
                                'zepto',
                                'zeptoFunctions',
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

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-appular-docs');

    grunt.registerTask('default', 'Builds dev SASS, opens browser window with dev url, and starts SASS watch', [
        'sass:dev',
        'open:dev',
        'watch'
    ]);

    grunt.registerTask('dev', 'Builds dev SASS and starts SASS watch', [
        'sass:dev',
        'watch'
    ]);

    grunt.registerTask('build', 'Builds production SASS, hints and builds production JS', [
        'sass:build',
        'jshint',
        'docs:build',
        'requirejs'
    ]);
};