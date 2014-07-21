/**
 * @appular boilerplate
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Router = Backbone.Router.extend({
            data: {}
        });

    return Router;
});