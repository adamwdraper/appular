({
    baseUrl: '../../',
    dir: '../../../build',
    paths: {
        'jqueryLib': 'empty:',
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/functions',
        'underscoreLib': 'libraries/underscore/underscore-1.4.4',
        'underscore': 'libraries/underscore/underscore',
        'backboneLib': 'libraries/backbone/backbone-1.0.0',
        'backbone': 'libraries/backbone/backbone',
        'domReady': 'libraries/require/plugins/domReady',
        'async': 'libraries/require/plugins/async',
        'json': 'libraries/require/plugins/json',
        'text': 'libraries/require/plugins/text'
    },
    modules: [
        {
            name: 'appular',
            include: [
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
})