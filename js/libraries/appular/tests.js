define([
    'jquery',
    'underscore',
    'backbone',
    'appular',
    'utilities/cookies/utility',
    'utilities/storage/utility'
], function ($, _, Backbone, Appular, cookies, storage) {
    describe('Appular', function () {

        it('Should have certain properties', function () {
            assert.property(Appular, 'version');
        });

        it('Should have a components property', function () {
            assert.property(Appular, 'components');
            expect(Appular.components).to.be.an('object');
        });

        it('Should have a config property with an environment', function () {
            assert.property(Appular, 'config');
            expect(Appular.config).to.be.instanceOf(Object);
            assert.property(Appular.config, 'env');
        });

        it('Can load an appular component', function (done) {
            Backbone.once('appular:component:required', function (component) {
                assert.ok(component);
                done();
            });

            Appular.require.component('_boilerplate', { foo: 'bar' });
        });

        it('Can load an appular router', function (done) {
            Backbone.once('appular:router:required', function (router) {
                assert.ok(router);
                expect(router).to.be.an.instanceOf(Object);
                done();
            });

            Appular.require.router('_boilerplate');
        });

        describe('Appular Backbone Object Extenstions', function () {

            describe('View', function () {
                var view;

                beforeEach(function () {
                    var router = new Backbone.Router(),
                        View = Backbone.View.extend({
                            router: router,
                            listeners: {
                                'change:test model': 'test',
                                'add collection': 'test',
                                'testing router': 'test',
                                'testing': 'test'
                            },
                            model: new Backbone.Model({
                                test: 'test'
                            }),
                            collection: new Backbone.Collection({
                                test: 'test'
                            }),
                            test: sinon.spy()
                        });

                    view = new View();
                });

                it('should be an object', function () {
                    expect(view).to.be.an('object');
                });

                it('should have certain properties', function () {
                    assert.property(view, 'config');
                    assert.property(view, 'plugins');
                    assert.property(view, 'views');
                });

                it('has common jquery objects', function () {
                    assert.property(view, '$window');
                    assert.property(view, '$document');
                    assert.property(view, '$body');
                });

                it('creates an router property', function () {
                    expect(view.router).to.be.an('object');
                });
                
                describe('Listeners porperty', function () {
                    it('hears model events', function () {
                        view.model.set('test', 'testing');
                        
                        assert(view.test.calledOnce);
                    });

                    it('hears collection events', function () {
                        view.collection.add({
                            'test': 'testing'
                        });
                        
                        assert(view.test.calledOnce);
                    });

                    it('hears router events', function () {
                        view.router.trigger('testing');
                        
                        assert(view.test.calledOnce);
                    });

                    it('hears custom events', function () {
                        view.trigger('testing');
                        
                        assert(view.test.calledOnce);
                    });
                });
            });

            describe('Router', function () {
                var router;

                beforeEach(function () {
                    cookies.set('cookie', 'testing');
                    storage.set('storage', 'testing');

                    var Router = Backbone.Router.extend({
                        params: {
                            k: {
                                value: 'testing'
                            },
                            x: 'test',
                            cookie: {
                                value: '',
                                loadFrom: 'cookie',
                                addToUrl: false
                            },
                            storage: {
                                value: '',
                                loadFrom: 'storage',
                                addToUrl: false
                            }
                        }
                    });

                    router = new Router();
                });

                it('Should have certain properties', function () {
                    assert.property(router, 'config');
                    assert.property(router, 'params');
                });

                describe('Params Collection', function () {
                    it('should have a collection for params', function () {
                        assert.property(router, 'collection');
                    });

                    it('should load params on construction', function () {
                        expect(router.get('k')).to.equal('testing');
                        expect(router.get('x')).to.equal('test');
                    });

                    it('can load from a cookie', function () {
                        router.collection.load();
                        expect(router.get('cookie')).to.equal('testing');
                    });

                    it('can load from a storage', function () {
                        router.collection.load();
                        expect(router.get('storage')).to.equal('testing');
                    });
                });

                describe('Initialize params', function () {
                    it('can load a string', function () {
                        router.loadParams('k:testing');

                        expect(router.get('k')).to.equal('testing');
                    });
                    
                    it('can load an object', function () {
                        router.loadParams({
                            k: 'testing'
                        });

                        expect(router.collection.get('k').get('value')).to.equal('testing');
                    });
                });

                describe('Navigate', function () {
                    it('can generate a hash', function () {
                        expect(router.getParamsHash()).to.equal('k:testing/x:test');
                    });
                });
            });

            describe('Collection', function () {
                var collection;

                beforeEach(function () {
                    collection = new Backbone.Collection();
                });

                it('Should have certain properties', function () {
                    assert.property(collection, 'config');
                });
            });

            describe('Model', function () {
                var model;

                beforeEach(function () {
                    model = new Backbone.Model();
                });

                it('Should have certain properties', function () {
                    assert.property(model, 'config');
                });
            });
        });
    });
});
