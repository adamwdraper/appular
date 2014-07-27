/*
 * Prod Config Settings
 */
requirejs.config({
    waitSeconds: 30,
    baseUrl: '/js/build',
    paths: {
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
            'libraries/jquery/jquery'
        ]
    },
    deps: [
        'modernizr',
        'jqueryFunctions',
        'backboneStickit'
    ],
    callback: function () {
        require([
            'domReady!',
            'appular'
        ], function (doc, Appular) {
            Appular.render();
        });
    }
});