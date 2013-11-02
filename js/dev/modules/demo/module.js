/**
 * @appular demo
 */

 define([
    'jquery',
    'underscore',
    'backbone',
    'text!modules/demo/templates/module.html'
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