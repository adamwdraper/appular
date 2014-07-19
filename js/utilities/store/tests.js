define([
    'jquery',
    'underscore',
    'backbone',
    './utility'
], function ($, _, Backbone, store) {
    var localStorage = window.localStorage;

    beforeEach(function () {
        localStorage.clear();
    });

    describe('Store Utility', function () {
        describe('Utility', function () {
            it('Exists', function () {
                assert.ok(store);
            });
        });

        describe('set and get', function () {
            it('can set and get a string', function () {
                var test = 'true';

                store.set('test', test);

                expect(store.get('test')).to.be.a('string');
                expect(store.get('test')).to.equal(test);
            });

            it('can set and get a number', function () {
                var test = 1;

                store.set('test', test);

                expect(store.get('test')).to.be.a('number');
                expect(store.get('test')).to.equal(test);
            });

            it('can set and get a boolean', function () {
                var test = true;

                store.set('test', test);

                expect(store.get('test')).to.be.a('boolean');
                expect(store.get('test')).to.equal(test);
            });

            it('can set and get an object', function () {
                var test = {
                    test: 'test',
                    test2: 1
                };

                store.set('test', test);

                expect(store.get('test')).to.be.an('object');
                expect(store.get('test')).to.deep.equal(test);
            });
        });

        describe('clear', function () {
            it('can clear all', function () {
                var test = 'true';

                store.set('test', test);

                store.clear();

                expect(store.get('test')).to.be.null;
            });
        });

        describe('unset', function () {
            it('can unset value', function () {
                var test = 'true';

                store.set('test', test);

                store.unset('test');

                expect(store.get('test')).to.be.null;
            });
        });
    });
});