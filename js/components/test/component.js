/**
 * @appular boilerplate
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'template!./template.html'
], function ($, _, Backbone, template) {
    var View = Backbone.View.extend({
            template: template,
            events: {},
            initialize: function () {},
            render: function () {
                this.$el.html(this.template());

                log('component', 'data', this.data);
                
                log('router', 'data', this.router.data);
                
                this.router.collection.each(function (param) {
                    log('router', param.getId(), param.getValue(), param);
                });

                return this;
            }
        });

    return View;
});