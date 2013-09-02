# Appular

A modular Javascript organizational scheme composed of AMD compatible modules based on Backbone and RequireJs.


## Appular Object Types
In Appular there are 3 different types of objects.  This is where the organization starts to come into play.  Each type has specific characteristics.

### Module
The main object that is called to put everything in motion. These can be full fledged Backbone apps with routers and all or a single Backbone View.  Modules are bound to dom elements by adding a `data-appular-module="module-name"` attribute to the element.

### Plugins
Plugins are here to help keep your projects [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself).  Use them for smaller tasks like long-polling and watching for infinite scrolling, or larger things like UI elements that you are using in several Modules.

### Utilities
These are top level "helpers" that can act as mini libraries.

## Grunt Magic

There are a couple of grunt commands that should be useful:

`grunt`:
- opens a browser window with the project url
- begins watching .scss files for changes

`grunt build`:
- creates production build of .scss files
- jshints all javascript
- creates documentation json with grunt-appular-docs plugin
- uses r.js to create production build of javascript