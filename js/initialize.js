define([
    'domReady!',
    'jquery',
    'underscore',
    'backbone',
    'appular'
], function (doc, $, _, Backbone, Appular) {
    var router = $('body').data('appularRouter'),
        $components = $('[data-appular-component]');

    // Render all components when router is ready
    Backbone.on('appular:router:required', function () {
        Backbone.history.start({
            root: window.location.pathname,
            pushState: true
        });
    });

    // Require all components when router is ready
    Backbone.on('appular:data:initialized', function () {
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

    // Render component after it is required 
    Backbone.on('appular:component:required', function (component) {
        component.render();
    });

    // log major libraries being used
    Appular.log('Library', 'Appular', 'v' + Appular.version);
    Appular.log('Library', 'jQuery', 'v' + $().jquery);
    Appular.log('Library', 'Backbone', 'v' + Backbone.VERSION);
    Appular.log('Library', 'Underscore', 'v' + _.VERSION);
    
    // require router
    if (router) {
        Appular.require.router(router);
    } else {
        throw new Error('Appular : No router found');
    }
});