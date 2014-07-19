/**
 * @appular plugin
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'template!./template.html'
], function ($, _, Backbone, template) {
    var View = Backbone.View.extend({
            template: template,
            bindings: {},
            listeners: {},
            events: {},
            initialize: function () {},
            render: function () {
                this.$el.html(this.template());
                
                return this;
            }
        });

    return View;
});