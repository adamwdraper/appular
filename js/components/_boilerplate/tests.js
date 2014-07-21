define([
    'jquery',
    'underscore',
    'backbone',
    './component'
], function ($, _, Backbone, Component) {
    var component;

    describe('Boilerplate Component', function () {
        describe('Construction', function () {
            beforeEach(function (done) {
                var Router = Backbone.Router.extend();

                component = new Component({
                    router: new Router()
                });

                done();
            });

            it('Exists', function () {
                assert.ok(component);
            });
        });
    });
});
