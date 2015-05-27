/**
 * @appular functions
 * @define jqueryFunctions
 */

define([
    'jquery'
], function ($) {
    $.fn.extend({
        /**
         * @function toggleText - toogles the text of an element between two values
         * @param value1:string
         * @param value1:string
         */
        toggleText: function (value1, value2) {
            return this.each(function () {
                var $this = $(this),
                    text = $this.text();

                if (text.indexOf(value1) > -1) {
                    $this.text(text.replace(value1, value2));
                } else {
                    $this.text(text.replace(value2, value1));
                }
            });
        },
        activate: function ($list) {
            return this.each(function () {
                var $this = $(this),
                    classes = 'active';

                if ($list) {
                    $list.removeClass(classes);
                } else {
                    $this.siblings().removeClass(classes);
                }

                $this.addClass(classes);
            });
        }
    });

    $.extend({
        getParameterByName: function (name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    });
});