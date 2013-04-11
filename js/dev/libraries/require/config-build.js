/*
 * Prod Config Settings
 */
requirejs.config({
    baseUrl: '/js/build',
    paths: {
        'jqueryLib': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
            'libraries/jquery/jquery-1.9.1'
        ]
    },
    deps: [
        'jqueryFunctions'
    ]
});