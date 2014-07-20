define([
    'jquery',
    'underscore',
    'backbone',
    './collection'
], function ($, _, Backbone, Collection) {
    var Router = Backbone.Router.extend({
            settings: {
                hash: {
                    paramSeparator: '&',
                    keyValSeparator: '=',
                    arraySeparator: '|'
                },
                // where the router will read the initial data from.  options: hash or query
                loadFrom: 'hash'
            },
            collection: new Collection(),
            initialize: function (options) {
                // Update the url hash whenever a param changes
                this.collection = options.collection;
                this.collection.on('change', function (param) {
                    this.navigateHash(!param.get('addToHistory'));
                }, this);
            },
            routes: {
                '*data': 'action'
            },
            action: function (data) {
                var params = [];

                if (data) {
                    _.each(data.split(this.settings.hash.paramSeparator), function (param) {
                        var id = param.split(this.settings.hash.keyValSeparator)[0],
                            value = param.split(this.settings.hash.keyValSeparator)[1];

                        if (value.indexOf(this.settings.hash.arraySeparator) !== -1) {
                            value = value.split(this.settings.hash.arraySeparator);
                        }

                        params.push({
                            id: id,
                            value: value
                        });
                    }, this);
                }
                
                this.collection.load(params);
            },
            navigateHash: function (replace) {
                // Generate and navigate to new hash
                var params = [],
                    hash = '',
                    value;

                this.collection.each(function (model) {
                    if (model.get('addToUrl')) {
                        // get value
                        value = model.get('value');

                        // join arrays for url
                        if (_.isArray(value)) {
                            value = value.join(this.settings.hash.arraySeparator);
                        }

                        if (value) {
                            // use alias if it is defined
                            params.push((model.get('alias') ? model.get('alias') : model.get('id')) + this.settings.hash.keyValSeparator + value);
                        }
                    }
                }, this);

                // Add bang to hash if enabled
                if (!_.isEmpty(params)){
                    hash += params.join(this.settings.hash.paramSeparator);
                }

                this.navigate(hash, {
                    trigger: false,
                    replace: replace
                });
            }
        });

    return new Router();
});