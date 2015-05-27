define([
    'jquery',
    'underscore',
    'backbone',
    './router'
], function ($, _, Backbone, Router) {
    var router = new Router();

    describe('Boilerplate Router', function () {
        describe('Router', function () {
            it('Exists', function () {
                assert.ok(router);
                expect(router).to.be.instanceOf(Object);
            });
        });
    });
});
