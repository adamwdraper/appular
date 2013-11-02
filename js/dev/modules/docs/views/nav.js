define([
    'jquery',
    'underscore',
    'backbone',
    'json!modules/docs/json/docs.json',
    'text!modules/docs/templates/nav.html'
], function ($, _, Backbone, Docs, Template) {

    var view = Backbone.View.extend({

            events: {},

            initialize: function() {},

            render: function() {
                this.$el.html(Template({
                    docs: Docs
                }));

                return this;
            }

        });

    return view;
});