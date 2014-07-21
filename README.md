# Appular

A modular Javascript organizational scheme based on Backbone, RequireJs and Mocha for testing.

Appular isn't really a framework.  It does a couple of nice things, like loading modules based on data attributes, but mostly it aims to help you:
- Organize JS into reusable modules
- Keep your JS DRY
- Break down your apps into smaller pieces to make it more maintainable and testable
- Eliminate spagetti code that can occur even when a JS framework is being used
- Create documentation for your modules from inline comments

## Slideshow
[http://slid.es/adamwdraper/appular](http://slid.es/adamwdraper/appular)

## Concepts
In Appular there are 4 different types of modules.

### Routers
This is where you do any prep work like authentication checks before any of your components load.  A router is added to a page by adding `data-appular-router="router-name"` to the body tag.

Routers also have a special collection that components use to share data.  Any changes to this collection are automatically populated to the hash.  

### Components
Components are bound to dom elements by adding a `data-appular-component="component-name"` attribute to the element.

### Plugins
Plugins are used by components and are meant for very specific functionality that you are using in several components.  Use them for tasks like long-polling or watching for infinite scrolling.  Ideally these are kept small and dumb. (i.e. they do their work, trigger events when necessary, and components react to those events)

### Utilities
These "helpers" that can act as mini libraries.

## Use
Included these scripts based on environment.  This way debuging is easy since nothing is uglified.

```
// Development Environment
<script src="/js/dev/libraries/require/require.js" data-main="/js/dev/libraries/require/configs/dev"></script>
```

```
// Production Environment
<script src="/js/build/initialize.js"></script>
```

Then add data attributes to elements that you want to attach components too, and Appular will load them for you.
```
<div data-appular-component="user-bar"></div>
```

## Documentation

Appular can generate documentation code for your project with its [documentation grunt plugin](https://github.com/adamwdraper/grunt-appular-docs).

## Grunt Commands
`grunt` or `grunt develop` : Starts server in development environment, and watches NODE.js and SASS files for changes.

`grunt test` : Runs tests.

`grunt production` : Starts server in production environment.

`grunt build` : Hints and builds production JS, runs tests, builds JS documentation, builds production CSS.


## Example Project
Here is an [example project using Node and Express.js](https://github.com/adamwdraper/appular-express-app)

## Readiness

Appular has been used on several large and small web apps and has made life a whole lot easier for both me and my team that's why I'm sharing.
