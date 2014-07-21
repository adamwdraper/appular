/**
 * @appular appular v0.9.5
 * @link https://github.com/adamwdraper/Appular
 * @define appular
 */

// Appular
// version : 0.9.5
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
            'router'
        ];

    Appular.version = '0.9.5';

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

    Appular.require = {};

    Appular.require.router = function (name) {
        var path = 'routers/' + name + '/router';

        require([
            path
        ], function (Router) {
            // log load in dev
            Appular.log('Router', name, path);

            Appular.router = new Router();

            Backbone.trigger('appular:router:required', Appular.router);
        });
    };
    
    Appular.require.component = function (name, options) {
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

    var DataModel = Backbone.Model.extend({
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
        DataCollection = Backbone.Collection.extend({
            model: DataModel,
            initialize: function () {
                _.bindAll(this, 'load');

                this.on('add', function (model) {
                    model.on('change:value', function () {
                        this.trigger('change:' + model.get('id'), model, model.get('id'));
                    }, this);
                }, this);
            },
            // Sets datas based on url data on initial load (ignores any data that are not defined in router)
            load: function (datas) {
                // datas sent from router
                _.each(datas, function (data) {
                    var id = data.id,
                        value = data.value,
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

                // datas from cookies
                _.each(this.models, function (model) {
                    if (model.get('loadFromCookie')) {
                        model.set({
                            value: cookies.get((model.get('alias') ? model.get('alias') : model.get('id')))
                        }, {
                            silent: true
                        });
                    }
                }, this);

                // all datas should be loaded
                Backbone.trigger('appular:data:initialized');
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
        });

    // Create backbone router
    Backbone.Router = (function(Router) {
        return Router.extend({
            config: Appular.config,
            data: {},
            settings: {
                hash: {
                    dataSeparator: '&',
                    keyValSeparator: '=',
                    arraySeparator: '|'
                },
                // where the router will read the initial data from.  options: hash or query
                loadFrom: 'hash'
            },
            collection: new DataCollection(),
            constructor: function() {
                var models = [];
                
                // add any data to collection
                _.each(this.data, function (value, key) {
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

                // call original constructor
                Router.apply(this, arguments);
            },
            routes: {
                '*data': 'action'
            },
            action: function (data) {
                this.loadData(data);
            },
            loadData: function (data) {
                var datas = [];
                
                if (_.isObject(data)) {
                    _.each(data, function (value, key) {
                        datas.push({
                            id: key,
                            value: value
                        });
                    });
                } else if (_.isString(data)) {
                    _.each(data.split(this.settings.hash.dataSeparator), function (data) {
                        var id = data.split(this.settings.hash.keyValSeparator)[0],
                            value = data.split(this.settings.hash.keyValSeparator)[1];

                        if (value.indexOf(this.settings.hash.arraySeparator) !== -1) {
                            value = value.split(this.settings.hash.arraySeparator);
                        }

                        datas.push({
                            id: id,
                            value: value
                        });
                    }, this);
                }
                
                this.collection.load(datas);
            },
            getDataHash: function () {
                // Generate and navigate to new hash
                var datas = [],
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
                            datas.push((model.get('alias') ? model.get('alias') : model.get('id')) + this.settings.hash.keyValSeparator + value);
                        }
                    }
                }, this);

                if (!_.isEmpty(datas)){
                    hash += datas.join(this.settings.hash.dataSeparator);
                }

                return hash;
            },
            navigateHash: function (replace) {
                var hash = this.getDataHash();

                this.navigate(hash, {
                    trigger: false,
                    replace: replace
                });
            },
            /**
            @function get - shortcut to get datas's value
            */
            get: function(name) {
                return this.collection.getValue(name);
            },
            /**
            @function set - shortcut to set data's value
            */
            set: function(id, value, options) {
                return this.collection.setValue(id, value, options);
            },
            /**
            @function set - shortcut to set data's value
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
    
    return Appular;
});