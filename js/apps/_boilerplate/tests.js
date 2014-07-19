define([
    'jquery',
    'underscore',
    'backbone',
    './app'
], function ($, _, Backbone, App) {
    var app = new App();

    describe('Boilerplate App', function () {
        describe('App', function () {
            it('Exists', function () {
                assert.ok(app);
                expect(app).to.be.instanceOf(Backbone.App);
            });
        });
    });
});
