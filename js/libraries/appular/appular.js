/**
 * @appular appular v1.0.0
 * @link https://github.com/adamwdraper/Appular
 * @define appular
 */

// Appular
// version : 1.0.0
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular

define([
    'module',
    'jquery',
    'underscore',
    'backbone',
    'utilities/cookies/utility',
    'utilities/storage/utility'
], function (module, $, _, Backbone, cookies, storage) {
    var Appular = {},
        $body = $('body'),
        $window = $('window'),
        $document = $('document'),
        router,
        $components,
        viewOptions = [
            'model',
            'collection',
            'el',
            'id',
            'attributes',
            'className',
            'tagName',
            'events',
            'router'
        ];

    Appular.version = '1.0.0';

    Appular.router = '';

    Appular.components = {};

    Appular.config = module.config();

    Appular.log = function () {
        var colors = {
                Library: 'FC913A',
                Router: '00A8C6',
                Component: '40C0CB',
                Event: '8FBE00'
            },
            info = Array.prototype.slice.call(arguments);

        if (module.config().env === 'develop') {
            console.log('%c' + info.join(' : '), 'color: #' + colors[info[0]]);
        }
    };

    Appular.initialize = {
        components: function () {
            _.each($components, function (element) {
                var $element = $(element),
                    name = $element.data('appularComponent'),
                    options = {
                        el: $element
                    };

                // add any data attributes to the components options
                _.each($element.data(), function (value, key) {
                    if (key !== 'appularComponent') {
                        options[key] = value;
                    }
                });

                Appular.require.component(name, options);
            });
        }
    };

    Appular.require = {
        router: function (name) {
            var path = 'routers/' + name + '/router';

            require([
                path
            ], function (Router) {
                // log load in dev
                Appular.log('Router', name, path);

                Appular.router = new Router();

                Backbone.trigger('appular:router:required', Appular.router);
            });
        },
        component: function (name, options) {
            var path = 'components/' + name + '/component';

            options = options || {};

            options.router = Appular.router;

            require([
                path
            ], function (Component) {
                Appular.log('Component', name, path);

                Appular.components[name] = new Component(options);

                Backbone.trigger('appular:component:required', Appular.components[name]);
            });
        }
    };
    
    // Kick it all off by finding the router and components
    Appular.render = function () {
        router = $('body').data('appularRouter');
        $components = $('[data-appular-component]');

        if (router) {
            Appular.require.router(router);
        } else {
            throw new Error('Appular : No router found');
        }
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

                // add router when sent in
                if (options.router) {
                    this.router = options.router;
                }

                // set up on's or listenTo's from the listeners object
                _.each(this.listeners, function (value, key) {
                    var events = key.split(' '),
                        property = _.last(events),
                        callback = _.isFunction(value) ? value : this[value];

                    // find out if we are listening to router, model, or collection so that we can use listenTo
                    if (property === 'router' || property === 'model' || property === 'collection') {
                        events.pop();
                    } else {
                        property = null;
                    }

                    // add routerropriate listening action
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
            constructor: function() {
                // add router
                this.router = Appular.router;
                
                Collection.apply(this, arguments);
            },
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
            constructor: function() {
                // add router
                this.router = Appular.router;
                
                Model.apply(this, arguments);
            },
            fetch: function (options) {
                if (this.fixture && this.config.useFixtures) {
                    options.url = this.fixture;
                }

                return Model.prototype.fetch.apply(this, arguments);
            }
        });
    })(Backbone.Model);

    var ParamsModel = Backbone.Model.extend({
            defaults: {
                id: '',
                value: '',
                alias: '',
                addToHistory: true,
                addToUrl: true,
                loadFrom: false,
                type: ''
            },
            getId: function () {
                return this.get('alias') ? this.get('alias') : this.get('id');
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
        ParamsCollection = Backbone.Collection.extend({
            model: ParamsModel,
            initialize: function () {
                _.bindAll(this, 'load');

                this.on('add', function (model) {
                    model.on('change:value', function () {
                        this.trigger('change:' + model.get('id'), model, model.get('id'));
                    }, this);
                }, this);
            },
            // Sets params based on url params on initial load (ignores any params that are not defined in router)
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

                // params from cookies or storage
                _.each(this.models, function (model) {
                    var value;

                    if (model.get('loadFrom') === 'cookie') {
                        value = cookies.get(model.getId());
                    } else if (model.get('loadFrom') === 'storage') {
                        value = storage.get(model.getId());
                    }

                    if (value) {
                        model.set({
                            value: value
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
                    cookies.set(model.getId(), value);
                }

                return this.get(id).set({
                    value: value
                }, options);
            }
        });

    // Create backbone router
    Backbone.Router = (function(Router) {
        return Router.extend({
            config: Appular.config,
            params: {},
            separators: {
                param: '/',
                keyValue: ':',
                array: '|'
            },
            // where the router will read the initial params from.  options: hash or query
            loadFrom: 'hash',
            collection: new ParamsCollection(),
            constructor: function() {
                var models = [];
                
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

                    models.push(model);
                }, this);

                this.collection.add(models);

                // trigger collection events on the router
                this.collection.on('all', function () {
                    var args = Array.prototype.slice.call(arguments),
                        event = args.shift();

                    if (event !== 'change:value') {
                        this.trigger(event, args);
                    }
                }, this);

                this.collection.on('change', function (param) {
                    this.navigateHash(!param.get('addToHistory'));
                }, this);

                // call original constructor
                Router.apply(this, arguments);
            },
            routes: {
                '*params': 'action'
            },
            action: function (params) {
                this.loadParams(params);
            },
            loadParams: function (params) {
                var models = [];
                
                if (_.isObject(params)) {
                    _.each(params, function (value, key) {
                        models.push({
                            id: key,
                            value: value
                        });
                    });
                } else if (_.isString(params)) {
                    _.each(params.split(this.separators.param), function (params) {
                        var id = params.split(this.separators.keyValue)[0],
                            value = params.split(this.separators.keyValue)[1];

                        if (value.indexOf(this.separators.array) !== -1) {
                            value = value.split(this.separators.array);
                        }

                        models.push({
                            id: id,
                            value: value
                        });
                    }, this);
                }
                
                this.collection.load(models);
            },
            getParamsHash: function () {
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
                            value = value.join(this.separators.array);
                        }

                        if (value) {
                            // use alias if it is defined
                            params.push((model.get('alias') ? model.get('alias') : model.get('id')) + this.separators.keyValue + value);
                        }
                    }
                }, this);

                if (!_.isEmpty(params)){
                    hash += params.join(this.separators.param);
                }

                return hash;
            },
            navigateHash: function (replace) {
                var hash = this.getParamsHash();

                this.navigate(hash, {
                    trigger: false,
                    replace: replace
                });
            },
            /**
            @function get - shortcut to get params's value
            */
            get: function(name, options) {
                options = options || {};
                
                return options.model ? this.collection.get(name) : this.collection.getValue(name);
            },
            /**
            @function set - shortcut to set params's value
            */
            set: function(id, value, options) {
                return this.collection.setValue(id, value, options);
            },
            /**
            @function set - shortcut to set params's value
            */
            toggle: function (name) {
                this.collection.setValue(name, !this.collection.get('value'));
            }
        });
    })(Backbone.Router);

    // add config for template variable syntax
    _.templateSettings = {
        evaluate: /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ title }}}
        escape: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
    };

    // set up listeners
    // Start history to tigger first route
    Backbone.on('appular:router:required', function (router) {
        Backbone.history.start(router.history);
    });

    // Require all components when router is ready
    Backbone.on('appular:params:initialized', function () {
        Appular.initialize.components();
    });

    // Render component after it is required 
    Backbone.on('appular:component:required', function (component) {
        component.render();
    });

    // log major libraries being used
    Appular.log('Library', 'Appular', 'v' + Appular.version);
    Appular.log('Library', 'jQuery', 'v' + $().jquery);
    Appular.log('Library', 'Backbone', 'v' + Backbone.VERSION);
    Appular.log('Library', 'Underscore', 'v' + _.VERSION);
    
    return Appular;
});