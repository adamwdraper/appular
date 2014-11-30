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
        'jqueryFunctions',
        'underscoreTemplate',
        'backboneStickit'
    ],
    callback: function () {
        require([
            'appular'
        ], function (Appular) {
            Appular.render();
        });
    }
});