var fs = require('fs');

module.exports = function(grunt) {
    var appular = {
            paths: {
                routers: './js/routers',
                components: './js/components',
                plugins: './js/plugins',
                utilities: './js/utilities'
            },
            routers: [],
            components: [],
            plugins: [],
            utilities: []
        };

    // add appular router definition for build
    fs.readdirSync(appular.paths.routers).forEach(function (name) {
        if (name[0] !== '.' && name[0] !== '_') {
            appular.routers.push({
                name: 'routers/' + name + '/router',
                exclude: [
                    'libraries/require/require'
                ]
            });
        }
    });

    // add appular component definition for build and test files
    fs.readdirSync(appular.paths.components).forEach(function (name) {
        if (name[0] !== '.' && name[0] !== '_') {
            appular.components.push({
                name: 'components/' + name + '/component',
                exclude: [
                    'libraries/require/require'
                ]
            });
        }
    });

    // add appular plugins definition for build files
    fs.readdirSync(appular.paths.plugins).forEach(function (name) {
        if (name[0] !== '.' && name[0] !== '_') {
            appular.plugins.push('plugins/' + name + '/plugin');
        }
    });

    // add appular utilities definition for build files
    fs.readdirSync(appular.paths.utilities).forEach(function (name) {
        if (name[0] !== '.' && name[0] !== '_') {
            appular.plugins.push('utilities/' + name + '/utility');
        }
    });

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        open : {
            server : {
                path: 'http://localhost:5000'
            }
        },
        watch: {
            express: {
                files:  [
                    'server.js'
                ],
                tasks:  [
                    'express:server'
                ],
                options: {
                    nospawn: true //Without this option specified express won't be reloaded
                }
            },
            testFiles: {
                files: ['**/tests.js'],
                tasks: ['test']
            }
        },
        concurrent: {
            build: [
                'jshint',
                'karma:ci',
                'requirejs'
            ],
            test: [
                'jshint',
                'karma:ci'
            ]
        },
        express: {
            options: {
                port: 5000
            },
            server: {
                options: {
                    script: 'server.js'
                }
            }
        },
        jshint: {
            all: [
                'js/routers/**/*.js',
                'js/components/**/*.js',
                'js/plugins/**/*.js',
                'js/utilities/**/*.js'
            ],
            options: {
                node: true,
                browser: true,
                curly: true,
                devel: true,
                eqeqeq: true,
                noarg: true,
                sub: true,
                expr: true,
                es5: true,
                globals: {
                    define: false,
                    describe: false,
                    it: false,
                    assert: false,
                    expect: false,
                    require: false,
                    requirejs: false
                },
                strict: false
            }
        },
        karma: {
            unit: {
                configFile: 'js/karma.conf.js'
            },
            ci: {
                configFile: 'js/karma.conf.js',
                singleRun: true,
                autoWatch: false
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    dir: 'js/build',
                    paths: {
                        'appular': 'libraries/appular/appular',
                        'jquery': 'empty:',
                        'jqueryFunctions': 'libraries/jquery/extensions/functions',
                        'underscore': 'libraries/underscore/underscore',
                        'underscoreTemplate': 'libraries/underscore/extensions/template',
                        'backbone': 'libraries/backbone/backbone',
                        'backboneStickit': 'libraries/backbone/extensions/stickit',
                        'log': 'libraries/log/log',
                        'domReady': 'libraries/require/plugins/domReady',
                        'template': 'libraries/require/plugins/template',
                        'text': 'libraries/require/plugins/text'
                    },
                    modules: [
                        {
                            name: 'libraries/require/require',
                            include: [
                                'libraries/require/require',
                                'libraries/require/configs/build',
                                'underscore',
                                'backbone',
                                'appular',
                                'jqueryFunctions',
                                'underscoreTemplate',
                                'backboneStickit',
                                'domReady',
                                'text'
                            ].concat(appular.plugins, appular.utilities)
                        }
                    ].concat(appular.routers, appular.components),
                    removeCombined: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'server'
    ]);

    grunt.registerTask('server', 'Starts server.', [
        'express:server',
        'watch'
    ]);

    grunt.registerTask('test', 'Runs tests', [
        'concurrent:test'
    ]);

    grunt.registerTask('build', 'Hints and builds production JS, runs tests, builds JS documentation', [
        'concurrent:build'
    ]);
};
