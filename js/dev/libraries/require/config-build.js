/*
 * Prod Config Settings
 */
requirejs.config({
    baseUrl: '/js/build',
    paths: {
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
            'libraries/jquery/jquery-1.10.2'
        ],
        'moment': [
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min',
            'libraries/moment/moment-2.4.0'
        ],
        'numeral': [
            '//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.5.0/numeral.min',
            'libraries/numeral/numeral-1.5.2'
        ]
    },
    deps: [
        'modernizr',
        'jqueryFunctions'
    ]
});