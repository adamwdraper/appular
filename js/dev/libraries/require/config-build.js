/*
 * Prod Config Settings
 */
requirejs.config({
    baseUrl: '/js/build',
    paths: {
        'jqueryLib': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
            'libraries/jquery/jquery-1.10.2'
        ],
        'zeptoLib': [
            '//cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min',
            'libraries/jquery/jquery-1.0'
        ],
        'moment': [
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min',
            'libraries/moment/moment'
        ],
        'numeral': [
            '//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min',
            'libraries/numeral/numeral'
        ]
    },
    deps: [
        'jqueryFunctions',
        'zeptoFunctions'
    ]
});