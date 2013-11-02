define([
    'jquery',
    'underscore',
    'backbone',
    'json!../../../../../package.json',
    'json!modules/docs/json/docs.json',
    'hbs!modules/docs/templates/docs.html'
], function ($, _, Backbone, Package, Docs, Template) {

    var view = Backbone.View.extend({

            events: {},

            initialize: function() {},

            render: function() {
                this.$el.html(Template({
                    docs: Docs,
                    codeUrl: Package.repository.url.match(/:([^.]+)/)[1]
                }));

                return this;
            }

        });

    return view;
});