# Appular

A modular Javascript organizational scheme composed of AMD compatible modules based on Backbone and RequireJs.


## Getting Started

Appular uses [Grunt.js](http://gruntjs.com/) to make creating and building projects more efficient.  In fact, this repository is actually a Grunt project template.  Follow these steps to get up and running with a new appular project:


### Preparing Grunt

If you've never installed Grunt or the Appular template follow these steps: (you will only have to do this once)

1. [Install grunt](http://gruntjs.com/getting-started#installing-the-cli) `npm install -g grunt-cli`
2. [Install grunt-init](http://gruntjs.com/project-scaffolding#grunt-init) `npm install -g grunt-init`
3. Add Appular as a Grunt Init Template `git clone git@github.com:adamwdraper/Appular.git ~/.grunt-init/appular`


### Creating a New Project

Now that everything is installed, the fun can begin:

1. Create your project directory and navigate too it
2. Create a new Appular project `grunt-init appular`
3. Follow the prompts to customize your project
4. Run `npm install` to install dependencies
5. Build an awesome web app
6. Share all your great modules with the community (so that we can all stop coding the sames basic functionalities over and over)


## Grunt Magic

There are a couple of grunt commands that should be useful:

`grunt`:
- opens a browser window with the project url
- begins watching .scss files for changes

`grunt release`:
- creates production build of .scss files
- jshints all javascript
- uses r.js to create production build of javascript 


## Appular Object Types
In Appular there are 3 different types of objects.  This is where the organization starts to come into play.  Each type has specific characteristics.

### Module
The main object that is called to put everything in motion. These can be full fledged Backbone apps with routers and all or a single Backbone View.  Modules are bound to dom elements by adding a `data-appular-module="module-name"` attribute to the element.

### Plugins
Plugins are here to help keep your projects [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself).  Use them for smaller tasks like long-polling and watching for infinite scrolling, or larger things like UI elements that you are using in several Modules.

### Utilities
These are top level "helpers" that can act as mini libraries.