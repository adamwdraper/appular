// Appular Sites
// version : 0.0.1
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular-Sites
require([
    'domReady!',
    'jquery',
    'underscore',
    'backbone'
], function (doc, $, _, Backbone) {
    var $module = $('[data-appular-module]');

    var startHistory = _.after($module.length, function () {
        Backbone.history.start();
    });

    if ($module) {
        $.each($module, function (index, element) {
            require([
                'modules/' + $(element).data('appular-module') + '/module'
            ], function (Module) {
                var module = Module.setElement($(element)).render();
                startHistory();
            });
        });

    } else {
        console.log('No module element found.');
    }

});