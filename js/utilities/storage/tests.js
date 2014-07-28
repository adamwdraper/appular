define([
    'jquery',
    'underscore',
    'backbone',
    './utility'
], function ($, _, Backbone, storage) {
    var localStorage = window.localStorage;

    beforeEach(function () {
        localStorage.clear();
    });

    describe('Storage Utility', function () {
        describe('Utility', function () {
            it('Exists', function () {
                assert.ok(storage);
            });
        });

        describe('set and get', function () {
            it('can set and get a string', function () {
                var test = 'true';

                storage.set('test', test);

                expect(storage.get('test')).to.be.a('string');
                expect(storage.get('test')).to.equal(test);
            });

            it('can set and get a number', function () {
                var test = 1;

                storage.set('test', test);

                expect(storage.get('test')).to.be.a('number');
                expect(storage.get('test')).to.equal(test);
            });

            it('can set and get a boolean', function () {
                var test = true;

                storage.set('test', test);

                expect(storage.get('test')).to.be.a('boolean');
                expect(storage.get('test')).to.equal(test);
            });

            it('can set and get an object', function () {
                var test = {
                    test: 'test',
                    test2: 1
                };

                storage.set('test', test);

                expect(storage.get('test')).to.be.an('object');
                expect(storage.get('test')).to.deep.equal(test);
            });
        });

        describe('clear', function () {
            it('can clear all', function () {
                var test = 'true';

                storage.set('test', test);

                storage.clear();

                expect(storage.get('test')).to.be.null;
            });
        });

        describe('unset', function () {
            it('can unset value', function () {
                var test = 'true';

                storage.set('test', test);

                storage.unset('test');

                expect(storage.get('test')).to.be.null;
            });
        });
    });
});