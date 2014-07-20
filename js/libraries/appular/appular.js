/**
 * @appular appular v0.9.0
 * @link https://github.com/adamwdraper/Appular
 * @define appular
 */

// Appular
// version : 0.9.0
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular

define([
    'module',
    'jquery',
    'underscore',
    'backbone',
    'utilities/cookies/utility'
], function (module, $, _, Backbone, cookies) {
    var Appular = {},
        $body = $('body'),
        $window = $('window'),
        $document = $('document'),
        viewOptions = [
            'model',
            'collection',
            'el',
            'id',
            'attributes',
            'className',
            'tagName',
            'events',
            'app'
        ];

    Appular.version = '0.9.0';

    Appular.app = '';

    Appular.components = {};

    Appular.config = module.config();

    Appular.log = function () {
        var colors = {
                Library: 'FC913A',
                App: '00A8C6',
                Component: '40C0CB',
                Event: '8FBE00'
            },
            info = Array.prototype.slice.call(arguments);

        if (module.config().env === 'develop') {
            console.log('%c' + info.join(' : '), 'color: #' + colors[info[0]]);
        }
    };

    Appular.require = {};

    Appular.require.app = function (name, options) {
        var path = 'apps/' + name + '/app';

        options = options || {};

        _.extend(options, {
            el: $('body')
        });

        require([
            path
        ], function (App) {
            // log load in dev
            Appular.log('App', name, path);

            Appular.app = new App(options);

            Backbone.trigger('appular:app:required', Appular.app);
        });
    };
    
    Appular.require.component = function (name, options) {
        var path = 'components/' + name + '/component';

        options = options || {};

        options.app = Appular.app;

        require([
            path
        ], function (Component) {
            Appular.log('Component', name, path);

            Appular.components[name] = new Component(options);

            Backbone.trigger('appular:component:required', Appular.components[name]);
        });
    };

    // Extending backbone objects
    Backbone.View = (function(View) {
        return View.extend({
            config: Appular.config,
            listeners: {},
            constructor: function(options) {
                this.plugins = {};
                this.views = {};

                // add common selectors
                this.$window = $window;
                this.$document = $document;
                this.$body = $body;

                options = options || {};

                // add app when sent in
                if (options.app) {
                    this.app = options.app;
                }

                // set up on's or listenTo's from the listeners object
                _.each(this.listeners, function (value, key) {
                    var events = key.split(' '),
                        property = _.last(events),
                        callback = _.isFunction(value) ? value : this[value];

                    // find out if we are listening to app, model, or collection so that we can use listenTo
                    if (property === 'app' || property === 'model' || property === 'collection') {
                        events.pop();
                    } else {
                        property = null;
                    }

                    // add appropriate listening action
                    if (property) {
                        if (this[property]) {
                            this.listenTo(this[property], events.join(' '), callback);
                        } else {
                            throw new Error('this.' + property + ' does not exist.');
                        }
                    } else {
                        this.on(events.join(' '), callback);
                    }
                }, this);

                View.apply(this, arguments);
            }
        });
    })(Backbone.View);
    
    Backbone.Collection = (function(Collection) {
        return Collection.extend({
            config: Appular.config,
            fetch: function (options) {
                if (this.fixture && this.config.useFixtures) {
                    options.url = this.fixture;
                }

                return Collection.prototype.fetch.apply(this, arguments);
            }
        });
    })(Backbone.Collection);

    Backbone.Model = (function(Model) {
        return Model.extend({
            config: Appular.config,
            fetch: function (options) {
                if (this.fixture && this.config.useFixtures) {
                    options.url = this.fixture;
                }

                return Model.prototype.fetch.apply(this, arguments);
            }
        });
    })(Backbone.Model);

    // Create backbone app
    var Param = Backbone.Model.extend({
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
        }),
        Params = Backbone.Collection.extend({
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
        }),
        ParamsRouter = Backbone.Router.extend({
            settings: {
                hash: {
                    useBang: false,
                    paramSeparator: '&',
                    keyValSeparator: '=',
                    arraySeparator: '|'
                },
                // where the router will read the initial data from.  options: hash or query
                loadFrom: 'hash'
            },
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
                    if (this.settings.hash.useBang && data.charAt(0) === '!') {
                        data = data.substr(1);
                    }

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
                if (this.settings.hash.useBang) {
                    hash += '!';
                }
                if (!_.isEmpty(params)){
                    hash += params.join(this.settings.hash.paramSeparator);
                }

                this.navigate(hash, {
                    trigger: false,
                    replace: replace
                });
            }
        });

    Backbone.App = (function(View) {
        return View.extend({
            config: Appular.config,
            params: {},
            collection: new Params(),
            router: {},
            constructor: function(options) {
                var models = [],
                    paramValues = _.omit(options, viewOptions);
                
                // add any params to collection
                _.each(this.params, function (value, key) {
                    var model = {
                            id: key
                        };

                    if (_.isString(value)) {
                        model.value = value;
                    }

                    if (_.isObject(value)) {
                        model = _.extend(model, value);
                    }

                    // set the value of any options
                    if (paramValues[key]) {
                        model.value = paramValues[key];
                    }

                    models.push(model);
                }, this);

                this.collection.add(models);

                // trigger collection events on the app
                this.collection.on('all', function () {
                    var args = Array.prototype.slice.call(arguments),
                        event = args.shift();

                    if (event !== 'change:value') {
                        this.trigger(event, args);
                    }
                }, this);

                // create router and add collection
                this.router = new ParamsRouter({
                    collection: this.collection
                });

                // call original constructor
                View.apply(this, arguments);
            },
            /**
            @function get - shortcut to get params's value
            */
            get: function(name) {
                return this.collection.getValue(name);
            },
            /**
            @function set - shortcut to set param's value
            */
            set: function(id, value, options) {
                return this.collection.setValue(id, value, options);
            },
            /**
            @function set - shortcut to set param's value
            */
            toggle: function (name) {
                this.collection.setValue(name, !this.collection.get('value'));
            }
        });
    })(Backbone.View);

    // add config for template variable syntax
    _.templateSettings = {
        evaluate: /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ title }}}
        escape: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
    };
    
    return Appular;
});