define([
    'underscore',
    'backbone',
    'modernizr'
], function (_, Backbone, modernizr) {
    var View = Backbone.View.extend({
            events: {},
            initialize: function () {},
            render: function () {
                return this;
            },
            local: function () {
                return modernizr.localStorage;
            },
            set: function (name, value) {
                window.localStorage.setItem(name, JSON.stringify(value));
            },
            get: function (name) {
                return JSON.parse(window.localStorage.getItem(name));
            },
            unset: function (name) {
                window.localStorage.removeItem(name);
            },
            clear: function () {
                localStorage.clear();
            }
        });

    return new View();
});