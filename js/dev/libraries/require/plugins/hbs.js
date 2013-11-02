/**
 * @appular hbs v0.0.1 - include file as text and convert it to a handlebars template
 * @define hbs!
 */

// hbtemplate.js plugin for requirejs / text.js
// it loads and compiles Handlebars templates
define([
    'handlebars'
], function (Handlebars) {
    return {
        load: function (name, req, onload, config) {
            req([
                'text!' + name
            ], function (template) {
                if (config.isBuild) {
                    //Indicate that the optimizer should not wait
                    //for this resource any more and complete optimization.
                    //This resource will be resolved dynamically during
                    //run time in the web browser.
                    onload();
                } else {
                    onload(Handlebars.compile(template));
                }
            });
        }
    };
});