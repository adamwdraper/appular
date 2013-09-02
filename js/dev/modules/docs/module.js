define([
    'jquery',
    'underscore',
    'backbone',
    'modules/docs/views/nav',
    'modules/docs/views/docs',
    'hbs!modules/docs/templates/module.html'
], function ($, _, Backbone, Nav, Docs,Template) {

    var nav,
        docs,
        View = Backbone.View.extend({

            events: {},

            initialize: function() {},

            render: function() {
                this.$el.html(Template());

                nav = new Nav({
                    el: '#module-docs-nav'
                }).render();

                docs = new Docs({
                    el: '#module-docs-docs'
                }).render();

                return this;
            }

        });

    return View;
});