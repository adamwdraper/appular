define([
    'jquery',
    'underscore',
    'backbone',
    'text!modules/user-bar/templates/module.html'
], function ($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        events: {},

        initialize: function() {},

        render: function(){
            this.$el.html(_.template(Template, {}));

            return this;
        }

    });

    return View;
});