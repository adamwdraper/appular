/**
 * @appular appular v2.0.0
 * @link https://github.com/adamwdraper/Appular
 * @define appular
 */

// Appular
// version : 2.0.0
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular

define([
    'domReady!',
    'module',
    'jquery',
    'underscore',
    'backbone',
    'utilities/cookies/utility',
    'utilities/storage/utility'
], function (doc, module, $, _, Backbone, cookies, storage) {
    var Appular = {},
        // common selectors
        $html = $('html'),
        $body = $('body'),
        $window = $(window),
        $document = $(document),
        // the router name
        $router,
        // all components on page
        $components,
        // count of required components
        requiredComponents = 0,
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

    Appular.version = '2.0.0';

    Appular.router = null;

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

        log('%c' + info.join(' : '), 'color: #' + colors[info[0]]);
    };

    Appular.initialize = {
        router: function () {
            var name = $router.data('appularRouter'),
                options = {};

            // add any data attributes to the routers options
            _.each($router.data(), function (value, key) {
                if (key !== 'appularRouter') {
                    options[key] = value;
                }
            });

            Appular.require.router(name, options);
        },
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
        router: function (name, options) {
            var path = 'routers/' + name + '/router';

            require([
                path
            ], function (Router) {
                // log load in dev
                Appular.log('Router', name, path);

                Appular.router = new Router(options);

                Backbone.trigger('appular:router:required', Appular.router);
            });
        },
        component: function (name, options) {
            var path = 'components/' + name + '/component';

            require([
                path
            ], function (Component) {
                Appular.log('Component', name, path);

                Appular.components[name] = new Component(options);

                Backbone.trigger('appular:component:required', Appular.components[name]);

                requiredComponents++;

                if (requiredComponents === $components.length) {
                    Backbone.trigger('appular:components:required');
                }
            });
        }
    };
    
    // Kick it all off by finding the router and components
    Appular.render = function () {
        $router = $body;
        $components = $('[data-appular-component]');

        if ($router.data('appular-router')) {
            Appular.initialize.router();
        } else {
            throw new Error('Appular : No router found');
        }
    };

    window._appular = Appular;

    // Extending backbone objects
    Backbone.View = (function(View) {
        return View.extend({
            config: Appular.config,
            listeners: {},
            constructor: function(options) {
                this.plugins = {};
                this.views = {};
                this.data = {};

                // add common selectors
                this.$window = $window;
                this.$document = $document;
                this.$body = $body;
                this.$html = $html;

                options = options || {};

                // add router
                this.router = Appular.router;

                // add model when sent in so we can assign listeners to it
                if (options.model) {
                    this.model = options.model;

                    delete options.model;
                }

                // add any data properties to data object
                _.each(options, function (value, key) {
                    if (!_.contains(viewOptions, key)) {
                        this.data[key] = value
                    }
                }, this);

                // set up on's or listenTo's from the listeners object
                _.each(this.listeners, function (value, key) {
                    var events = key.split(' '),
                        callback = _.isFunction(value) ? value : this[value];

                    // find out if we are listening to property so that we can use listenTo
                    property = events.length > 1 ? events.pop() : null;
    
                    // add route appopriate listening action
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
            },
            reset: function () {
                this.clear({
                    silent: true
                });

                this.set(this.defaults, {
                    silent: true
                });
            },
            /**
            @function toggle - shortcut to toggle a booleans value
            */
            toggle: function (name) {
                this.set(name, !this.get(name));
            }
        });
    })(Backbone.Model);

    var RouterCollection = Backbone.Collection.extend({
            model: Backbone.Model.extend({
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
            initialize: function () {
                _.bindAll(this, 'load');

                this.on('add', function (model) {
                    model.on('change:value', function () {
                        this.trigger('change:' + model.get('id'), model, model.get('id'));

                        this.persistValue(model, model.get('value'));
                    }, this);
                }, this);
            },
            // Sets params based on url params on initial load (ignores any params that are not defined in router)
            loadParams: function (params) {
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
            },
            load: function () {
                // load params from url, cookies or storage
                _.each(this.models, function (model) {
                    var value;

                    if (model.get('loadFrom') === 'url') {
                        value = $.getParameterByName(model.getId());
                    } else if (model.get('loadFrom') === 'cookie') {
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

                return this.get(id).set({
                    value: value
                }, options);
            },
            /**
            @function setValueOf - shortcut to set model's value
            */
            persistValue: function(model, value) {
                // persist data to cookie or storage if necessary
                if (model.get('loadFrom') === 'cookie') {
                    cookies.set(model.getId(), value);
                } else if (model.get('loadFrom') === 'storage') {
                    storage.set(model.getId(), value);
                }
            }
        });

    // Extend backbone router
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
            collection: new RouterCollection(),
            components: Appular.components,
            routes: {
                '*params': 'action'
            },
            action: function (params) {
                // this.loadParams(params);

                this.renderAll();
            },
            renderAll: function () {
                _.each(this.components, function (component) {
                    component.render();
                });
            },
            setup: function () {
                this.start();
            },
            start: function () {
                Backbone.history.start(this.history);
            },
            constructor: function(options) {
                // add common selectors
                this.$window = $window;
                this.$document = $document;
                this.$body = $body;
                this.$html = $html;

                this.data = {};

                // add any data properties to data object
                _.each(options, function (value, key) {
                    this.data[key] = value
                }, this);

                // add any params to collection
                _.each(this.params, function (value, key) {
                    var model = {
                            id: key
                        };

                    if (_.isObject(value)) {
                        model = _.extend(model, value);
                    } else {
                        model.value = value;
                    }

                    this.collection.add(model);
                }, this);

                // trigger collection events on the router
                this.collection.on('all', function () {
                    var args = Array.prototype.slice.call(arguments),
                        event = args.shift();

                    if (event !== 'change:value') {
                        this.trigger(event, args);
                    }
                }, this);

                // load params
                this.collection.load();

                this.collection.on('change', function (param) {
                    this.navigateHash(!param.get('addToHistory'));
                }, this);

                // call original constructor
                Router.apply(this, arguments);
            },
            loadParams: function (params) {
                var models = [];
                
                _.each(params.split(this.separators.param), function (params) {
                    var id = params.split(this.separators.keyValue)[0],
                        value = params.split(this.separators.keyValue)[1];

                    if (value) {
                        if (value.indexOf(this.separators.array) !== -1) {
                            value = value.split(this.separators.array);
                        }

                        models.push({
                            id: id,
                            value: value
                        });
                    }
                }, this);

                if (models.length) {
                    this.collection.set(models, {
                        remove: false
                    });
                }
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

    // set up listeners
    Backbone.on('appular:router:required', function () {
        Appular.initialize.components();
    });

    Backbone.on('appular:components:required', function () {
        Appular.router.setup();
    });

    // log major libraries being used
    Appular.log('Library', 'Appular', 'v' + Appular.version);
    Appular.log('Library', 'Require', 'v' + require.version);
    Appular.log('Library', 'jQuery', 'v' + $().jquery);
    Appular.log('Library', 'Backbone', 'v' + Backbone.VERSION);
    Appular.log('Library', 'Underscore', 'v' + _.VERSION);
    
    return Appular;
});