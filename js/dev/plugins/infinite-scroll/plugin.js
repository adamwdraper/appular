define([
    'jquery',
    'underscore',
    'backbone',
    'text!plugins/infinite-scroll/templates/loader.html'
], function($, _, Backbone, template) {
    var View = Backbone.View.extend({
            events: {},
            options: {
                padding: 500
            },
            initialize: function () {
                _.bindAll(this, 'nearBottom', 'reset');

                this.on('nearBottom', this.nearBottom);
                this.on('reset', this.reset);

                this.suffix = $(this.el).attr('id');
            },
            render: function () {
                this.scrollSpy();

                this.$loader = $(_.template(template, {
                    suffix: this.suffix
                }));

                return this;
            },
            renderLoader: function () {
                this.$el.append(this.$loader);
            },
            removeLoader: function () {
                this.$loader.remove();
            },
            scrollSpy: function () {
                var _this = this;
                // listen for scroll
                $(document).on('scroll.infinte-scroll-' + this.suffix, function () {
                    if((_this.$el.outerHeight() + _this.$el.offset().top) - ($(document).scrollTop() + $(window).height()) < _this.options.padding) {
                        _this.trigger('nearBottom');
                    }
                });
            },
            nearBottom: function () {
                $(document).off('scroll.infinte-scroll-' + this.suffix);
                this.renderLoader();
            },
            reset: function () {
                this.removeLoader();
                this.scrollSpy();
            },
            destroy: function() {
                $(window).off('scroll.infinte-scroll-' + this.suffix);
                this.removeLoader();
            }
        });

    return View;
});