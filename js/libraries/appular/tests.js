define([
    'jquery',
    'underscore',
    'backbone',
    'appular'
], function ($, _, Backbone, Appular) {
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
                expect(router).to.be.an.instanceOf(Backbone.Router);
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
                    var Router = Backbone.Router.extend({
                        data: {
                            k: {
                                value: 'testing'
                            },
                            x: 'test'
                        }
                    });

                    router = new Router();
                });

                it('Should have certain properties', function () {
                    assert.property(router, 'config');
                    assert.property(router, 'data');
                });

                describe('Data Collection', function () {
                    it('should have a collection for data', function () {
                        assert.property(router, 'collection');
                    });

                    it('should load data on construction', function () {
                        expect(router.collection.get('k').get('value')).to.equal('testing');
                        expect(router.collection.get('x').get('value')).to.equal('test');
                    });
                });

                describe('Load data', function () {
                    it('can load a string', function () {
                        router.loadData('k=testing');

                        expect(router.collection.get('k').get('value')).to.equal('testing');
                    });
                    
                    it('can load an object', function () {
                        router.loadData({
                            k: 'testing'
                        });

                        expect(router.collection.get('k').get('value')).to.equal('testing');
                    });
                });

                describe('Navigate', function () {
                    it('can generate a hash', function () {
                        expect(router.getDataHash()).to.equal('k=testing&x=test');
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
