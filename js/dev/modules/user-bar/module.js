/**
 * @appular userBar
 */

 define([
    'jquery',
    'underscore',
    'backbone',
    'text!modules/user-bar/templates/module.html'
], function ($, _, Backbone, Template) {

    var view = Backbone.View.extend({

        events: {},

        initialize: function() {},

        render: function(){
            this.$el.html(_.template(Template, {}));

            return this;
        }

    });

    return view;
});