define([
    'jquery',
    'underscore',
    'backbone',
    'json!modules/docs/json/docs.json',
    'text!modules/docs/templates/nav.html'
], function ($, _, Backbone, docs, template) {
    var view = Backbone.View.extend({
            events: {},
            initialize: function () {},
            render: function () {
                this.$el.html(_.template(template, {
                    docs: docs
                }));

                return this;
            }
        });
    
    return view;
});