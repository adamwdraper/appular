define([
    'underscore'
], function (_) {
    var originaTemplate = _.template,
        templateHelpers = {};

    // add config for template variable syntax
    _.templateSettings = {
        evaluate: /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ title }}}
        escape: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
    };

    _.mixin({
        addTemplateHelpers: function (newHelpers) {
            _.extend(templateHelpers, newHelpers);
        },
        template: function (text, data, settings) {
            // replace the built in _.template function with one that supports the addTemplateHelpers
            // function above. Basically the combo of the addTemplateHelpers function and this new
            // template function allows us to mix in global "helpers" to the data objects passed
            // to all our templates when they render. This replacement template function just wraps
            // the original _.template function, so it sould be pretty break-resistent moving forward.

            if (data) {
                // if data is supplied, the original _.template function just returns the raw value of the
                // render function (the final rentered html/text). So in this case we just extend
                // the data param with our templateHelpers and return raw value as well.

                _.defaults(data, templateHelpers); // extend data with our helper functions
                return originaTemplate.apply(this, arguments); // pass the buck to the original _.template function
            }
            
            var template = originaTemplate.apply(this, arguments);

            var wrappedTemplate = function (data) {
                data = _.defaults({}, data, templateHelpers);
                return template.call(this, data);
            };

            return wrappedTemplate;
        }
    });
});