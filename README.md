# Appular

A modular Javascript organizational scheme composed of AMD compatible modules based on Backbone and RequireJs.

Appular isn't really a framework.  It does a couple of nice things, like loading modules based on data attributes, but mostly it aims to help you:
- Organize JS into reusable modules
- Keep your JS DRY
- Create an event driven structure
- Break down your apps into smaller pieces to make it more maintainable and testable
- Eliminate spagetti code that can occur even when a JS framework is being used
- Create documentation for your modules from inline comments

## Concepts
In Appular there are 3 different types of modules.

### Modules
Modules are Backbone Views that represet an element on the page.  They are meant to be reusable, and to function independent of any other modules on the page.

### Plugins
Plugins are used by modules and are meant for very specific functionality that you are using in several modules.  Use them for tasks like long-polling or watching for infinite scrolling.  Ideally these are kept small and dumb. (i.e. they do their work, trigger events when necessary, and modules react to those events)

### Utilities
These are top level "helpers" that can act as mini libraries.

## Use
Included these scripts based on environment.  This way debuging is easy since nothing is uglified.

```
// Development Environment
<script src="/js/dev/libraries/require/require-2.1.9.js"></script>
<script src="/js/dev/libraries/require/config.js"></script>
<script src="/js/dev/libraries/appular/appular.js"></script>
```

```
// Production Environment
<script src="/js/build/appular.js"></script>
```

Then add data attributes to elements that you want to attach modules too, and Appular will load them for you.
```
<div data-appular-module="feed"></div>
```

Use additional data attributes to pass options to modules.
```
<div data-appular-module="feed" data-count="10"></div>
```

Count would then be available in the module as `this.options.count`

## Project Documentation

Appular can generate documentation code for your project with its [grunt plugin](https://github.com/adamwdraper/grunt-appular-docs).

## Grunt Commands
`grunt`:
- jshints all javascript
- creates documentation json with grunt-appular-docs plugin
- uses r.js to create production build of javascript

## Example Project
Here is an [example project using Node and Express.js](https://github.com/adamwdraper/appular-express-app)

## Readiness

Appular has been used on several large and small web apps and has made life a whole lot easier for both me and my team that's why I'm sharing.
