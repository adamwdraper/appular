/*
 * Prod Config Settings
 */
requirejs.config({
    baseUrl: '/js/build',
    paths: {
        'jqueryLib': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
            'libraries/jquery/jquery-1.9.1.min'
        ],
        'moment': [
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min',
            'libraries/moment/moment.min'
        ],
        'numeral': [
            '//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min',
            'libraries/numeral/numeral.min'
        ]
    },
    deps: [
        'jqueryFunctions'
    ]
});