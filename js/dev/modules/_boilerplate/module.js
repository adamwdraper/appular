/**
 * @appular boilerplate
 */

 define([
    'jquery',
    'underscore',
    'backbone',
    'text!modules/_boilerplate/templates/module.html'
], function ($, _, Backbone, template) {
    var view = Backbone.View.extend({
            events: {},
            initialize: function() {},
            render: function() {
                this.$el.html(_.template(template, {}));
                return this;
            }
        });

    return view;
});