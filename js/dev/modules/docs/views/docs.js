define([
    'jquery',
    'underscore',
    'backbone',
    'json!../../../../../package.json',
    'json!modules/docs/json/docs.json',
    'text!modules/docs/templates/docs.html'
], function ($, _, Backbone, packageJson, Docs, template) {

    var view = Backbone.View.extend({

            events: {},

            initialize: function() {},

            render: function() {
                this.$el.html(_.template(template({
                    docs: Docs,
                    codeUrl: packageJson.repository.url.match(/:([^.]+)/)[1]
                })));

                return this;
            }

        });

    return view;
});