define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var View = Backbone.View.extend({
            events: {},
            initialize: function () {},
            render: function () {
                return this;
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