/**
 * @appular demo
 */

 define([
    'jquery',
    'underscore',
    'backbone',
    'modules/demo/router',
    'text!modules/demo/templates/module.html'
], function ($, _, Backbone, Router, Template) {

    var view = Backbone.View.extend({

        events: {},

        initialize: function() {},

        render: function() {
            this.$el.html(_.template(Template, {}));

            return this;
        }

    });

    return view;
});