define([
    'domReady!',
    'jquery',
    'underscore',
    'backbone',
    'appular'
], function (doc, $, _, Backbone, Appular) {
    var app = $('body').data('appularApp'),
        options = {},
        $components = $('[data-appular-component]');

    // Render all components when app is ready
    Backbone.on('appular:app:required', function () {
        Backbone.history.start({
            root: window.location.pathname,
            pushState: true
        });
    });

    // render app when all params are loaded
    Backbone.on('appular:params:initialized', function () {
        Appular.app.render();
    });

    // Render all components when app is ready
    Backbone.on('appular:component:required', function (component) {
        component.render();
    });

    // Render all components when app is ready
    Backbone.on('appular:app:rendered', function () {
        _.each($components, function (element) {
            var $element = $(element),
                name = $element.data('appularComponent'),
                options = {
                    el: $element
                };

            // add any data attributes to the components options
            _.each($element.data(), function (value, key) {
                if (key !== 'appularComponent') {
                    options[key] = value;
                }
            });

            Appular.require.component(name, options);
        });
    });

    // log major libraries being used
    Appular.log('Library', 'Appular', 'v' + Appular.version);
    Appular.log('Library', 'jQuery', 'v' + $().jquery);
    Appular.log('Library', 'Backbone', 'v' + Backbone.VERSION);
    Appular.log('Library', 'Underscore', 'v' + _.VERSION);
    
    // require app
    if (app) {
        Appular.require.app(app, options);
    } else {
        throw new Error('Appular : No app found');
    }
});