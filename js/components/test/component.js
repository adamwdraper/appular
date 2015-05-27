/**
 * @appular test
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

                this.router.collection.each(function (param) {
                    log('router', param.getId(), param.getValue(), param);
                });

                log('component', 'data', this.data);

                this.router.set('hash', 'hash updated');

                return this;
            }
        });

    return View;
});