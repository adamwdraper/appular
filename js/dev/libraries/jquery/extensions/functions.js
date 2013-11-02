/**
 * @appular functions
 * @define jqueryFunctions
 */

define([
    'jquery'
], function ($) {
    /**
     * @function toggleText - toogles the text of an element between two values
     * @param value1:string
     * @param value1:string
     */
    $.fn.toggleText = function (value1, value2) {
        return this.each(function () {
            var $this = $(this),
                text = $this.text();

            if (text.indexOf(value1) > -1) {
                $this.text(text.replace(value1, value2));
            } else {
                $this.text(text.replace(value2, value1));
            }
        });
    };
});