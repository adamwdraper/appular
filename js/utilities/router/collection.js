define([
    'jquery',
    'underscore',
    'backbone',
    './model'
], function ($, _, Backbone, Param) {
    var Collection = Backbone.Collection.extend({
            model: Param,
            initialize: function () {
                _.bindAll(this, 'load');

                this.on('add', function (model) {
                    model.on('change:value', function () {
                        this.trigger('change:' + model.get('id'), model, model.get('id'));
                    }, this);
                }, this);
            },
            // Sets params based on url data on initial load (ignores any parameters that are not defined in app)
            load: function (params) {
                // params sent from router
                _.each(params, function (param) {
                    var id = param.id,
                        value = param.value,
                        model = this.get(id);

                    // check for alias match
                    if (!model) {
                        model = _.find(this.models, function (model) {
                            return model.get('alias') === id;
                        });
                    }

                    if (model) {
                        model.set({
                            value: value
                        }, {
                            silent: true
                        });
                    }
                }, this);

                // params from cookies
                _.each(this.models, function (model) {
                    if (model.get('loadFromCookie')) {
                        model.set({
                            value: cookies.get((model.get('alias') ? model.get('alias') : model.get('id')))
                        }, {
                            silent: true
                        });
                    }
                }, this);

                // all params should be loaded
                Backbone.trigger('appular:params:initialized');
            },
            /**
            @function getValue - shortcut to get model's value
            */
            getValue: function(name) {
                var model = this.get(name),
                    value;

                if (model) {
                    value = model.getValue();
                }

                return value;
            },

            /**
            @function setValueOf - shortcut to set model's value
            */
            setValue: function(id, value, options) {
                var model = this.get(id);

                options = options || {};

                if (model.get('loadFromCookie')) {
                    cookies.set((model.get('alias') ? model.get('alias') : id), value);
                }

                return this.get(id).set({
                    value: value
                }, options);
            }
        })
    return Collection
});