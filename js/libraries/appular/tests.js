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

        it ('Should have a components property', function () {
            assert.property(Appular, 'components');
            expect(Appular.components).to.be.an('object');
        });

        it ('Should have a config property with an environment', function () {
            assert.property(Appular, 'config');
            expect(Appular.config).to.be.instanceOf(Object);
            assert.property(Appular.config, 'env');
        });

        it ('Can load an appular component', function (done) {
            Backbone.once('appular:component:required', function (component) {
                assert.ok(component);
                done();
            });

            Appular.require.component('_boilerplate', { foo: 'bar' });
        });

        it ('Can load an appular app', function (done) {
            Backbone.once('appular:app:required', function (app) {
                assert.ok(app);
                expect(app).to.be.an.instanceOf(Backbone.App);
                done();
            });

            Appular.require.app('_boilerplate');
        });

        describe('Appular Backbone Object Extenstions', function () {

            describe('View', function () {
                var view;

                beforeEach(function () {
                    var app = new Backbone.App(),
                        View = Backbone.View.extend({
                            app: app,
                            listeners: {
                                'change:test model': 'test',
                                'add collection': 'test',
                                'testing app': 'test',
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

                it ('should be an object', function () {
                    expect(view).to.be.an('object');
                });

                it ('should have certain properties', function () {
                    assert.property(view, 'config');
                    assert.property(view, 'plugins');
                    assert.property(view, 'views');
                });

                it ('has common jquery objects', function () {
                    assert.property(view, '$window');
                    assert.property(view, '$document');
                    assert.property(view, '$body');
                });

                it ('creates an app property', function () {
                    expect(view.app).to.be.an('object');
                });
                
                describe('Listeners porperty', function () {
                    it ('hears model events', function () {
                        view.model.set('test', 'testing');
                        
                        assert(view.test.calledOnce);
                    });

                    it ('hears collection events', function () {
                        view.collection.add({
                            'test': 'testing'
                        });
                        
                        assert(view.test.calledOnce);
                    });

                    it ('hears app events', function () {
                        view.app.trigger('testing');
                        
                        assert(view.test.calledOnce);
                    });

                    it ('hears custom events', function () {
                        view.trigger('testing');
                        
                        assert(view.test.calledOnce);
                    });
                });
            });

            describe('App', function () {
                var app;

                beforeEach(function () {
                    app = new Backbone.App();
                });

                it ('Should have certain properties', function () {
                    assert.property(app, 'config');
                    assert.property(app, 'params');
                    assert.property(app, 'router');
                });
            });

            describe('Collection', function () {
                var collection;

                beforeEach(function () {
                    collection = new Backbone.Collection();
                });

                it ('Should have certain properties', function () {
                    assert.property(collection, 'config');
                });
            });

            describe('Model', function () {
                var model;

                beforeEach(function () {
                    model = new Backbone.Model();
                });

                it ('Should have certain properties', function () {
                    assert.property(model, 'config');
                });
            });
        });
    });
});
