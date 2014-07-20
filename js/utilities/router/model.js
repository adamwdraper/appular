define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {
    var Model = Backbone.Model.extend({
            defaults: {
                id: '',
                value: '',
                alias: '',
                addToHistory: true,
                addToUrl: true,
                loadFromCookie: false,
                type: ''
            },
            getValue: function () {
                var type = this.get('type'),
                    value = this.get('value');

                // typecast for retrieval
                if (type === 'number') {
                    value = Number(value);
                }

                return value;
            }
        });

    return Model;
});