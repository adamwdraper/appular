// Appular Sites
// version : 0.0.1
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular-Sites
require([
    'domReady!',
    '{%= $ %}',
    'underscore',
    'backbone'
], function (doc, $, _, Backbone) {
    var $modules = $('[data-appular-module]'),
        startHistory = _.after($modules.length, function () {
            Backbone.history.start();
        });

    if ($modules.length) {
        $.each($modules, function (index, element) {
            require([
                'modules/' + $(element).data('appular-module') + '/module'
            ], function (Module) {
                var module = new Module({
                    el: $(element)
                });
                module.render();
                startHistory();
            });
        });
    } else {
        console.log('No module element found.');
    }
});