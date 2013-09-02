/*
 * Dev Config Settings
 */
requirejs.config({
    baseUrl: '/js/dev',
    paths: {
        'jqueryLib': 'libraries/jquery/jquery-1.10.2',
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/extensions/functions',
        'underscoreLib': 'libraries/underscore/underscore-1.5.1',
        'underscore': 'libraries/underscore/underscore',
        'backboneLib': 'libraries/backbone/backbone-1.0.0',
        'backbone': 'libraries/backbone/backbone',
        'handlebars': 'libraries/handlebars/handlebars',
        'handlebarsHelpers': 'libraries/handlebars/helpers/helpers',
        'moment': 'libraries/moment/moment',
        'numeral': 'libraries/numeral/numeral',
        'domReady': 'libraries/require/plugins/domReady',
        'async': 'libraries/require/plugins/async',
        'json': 'libraries/require/plugins/json',
        'text': 'libraries/require/plugins/text',
        'hbs': 'libraries/require/plugins/hbs'
    },
    deps: [
        'jqueryFunctions',
        'handlebarsHelpers'
    ]
});