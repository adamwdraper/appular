// Appular Sites
// version : 1.0.0
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular
require([
    'domReady!',
    'jquery',
    'underscore',
    'backbone'
], function (doc, $, _, Backbone) {
    var $modules = $('[data-appular-module]'),
        startHistory = _.after($modules.length, function () {
            Backbone.history.start({
                pushState: true
            });
        }),
        renderModules = function () {
            _.each($modules, function (element) {
                var $element = $(element),
                    options = {
                        el: $element
                    };

                _.each($element.data(), function (value, key) {
                    if (key !== 'appularModule') {
                        options[key] = value;
                    }
                });

                require([
                    'modules/' + $element.data('appularModule') + '/module'
                ], function (Module) {
                    var module = new Module(options);
                    
                    module.plugins = {};
                    module.views = {};
                    module.models = {};
                    module.collections = {};
                    
                    module.render();

                    startHistory();
                });
            });
        };

    if ($modules.length) {
        renderModules();
    }
});