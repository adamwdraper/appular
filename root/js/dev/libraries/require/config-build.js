/*
 * Prod Config Settings
 */
requirejs.config({
    baseUrl: '/js/build',
    paths: {
        '{%= $ %}Lib': [
            '{%= $_cdn %}',
            'libraries/{%= $ %}/{%= $ %}-{%= $_version %}'
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
        '{%= $ %}Functions'
    ]
});