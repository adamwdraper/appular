// Appular Sites
// version : 0.0.3
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular
require([
    'domReady!',
    'jquery',
    'underscore',
    'backbone'
], function (doc, $, _, Backbone) {
    var app = $('body').data('appular-app'),
        $modules = $('[data-appular-module]'),
        startHistory = _.after($modules.length, function () {
            Backbone.history.start({
                pushState: true
            });
        }),
        renderModules = function () {
            $.each($modules, function (index, element) {
                require([
                    'modules/' + $(element).data('appular-module') + '/module'
                ], function (Module) {
                    var module = new Module({
                        el: $(element),
                        app: app
                    });
                    module.render();
                    startHistory();
                });
            });
        };

    Backbone.on('app:initialized', renderModules);

    if (app) {
        require([
            'apps/' + app + '/app'
        ], function (App) {
            var app = new App({
                    el: $('body')
                });

            app.render();
        });
    } else {
        Backbone.trigger('app:initialized');
    }
});