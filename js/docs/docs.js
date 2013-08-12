var fs = require('fs'),
    util = require('util'),
    _ = require('underscore'),
    options = {
        input: './js/dev',
        output: './js/docs/docs.json',
        pretty: false
    },
    tags = [
        'appular',
        'extends',
        'define',
        'link',
        'function',
        'event'
    ],
    docsJson = {},
    regExpEscape = function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    walk = function (dir, done) {
        fs.readdir(dir, function (error, list) {
            if (error) {
                return done(error);
            }

            var i = 0,
                next = function () {
                    var file = list[i++],
                        path,
                        re = new RegExp(regExpEscape(options.input) + '\/?', 'g'),
                        directory = dir.replace(re, ''),
                        directories = directory.split('/');

                    if (!file) {
                        return done(null);
                    }

                    path = dir + '/' + file;

                    fs.stat(path, function (error, stat) {

                        if (stat && stat.isDirectory()) {
                            walk(path, function () {
                                next();
                            });
                        } else {
                            // open file
                            try {
                                fs.createReadStream(path, {
                                    encoding: 'utf-8',
                                    start: 0,
                                    end: 100
                                })
                                .on('data', function (snippet) {
                                    var data,
                                        comments,
                                        newParent,
                                        parent,
                                        module = {};

                                    if (snippet.indexOf('@appular') !== -1) {
                                        data = fs.readFileSync(path, 'utf-8');

                                        // log file path
                                        console.log(directories.join('/') + '/' + file);

                                        // gets all multi line comments in file
                                        comments = data.match(/\/\*+([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//gm);

                                        _.each(comments, function (comment) {
                                            var doc = {};
                                            // extracts all tags
                                            doc.lines = comment.match(/(@.*[^\r\n])/g);

                                            // _.each(doc.lines, function (line) {

                                            // });

                                        });

                                        // make sure root types are defined
                                        if (!docsJson[directories[0]]) {
                                            docsJson[directories[0]] = [];
                                        }

                                        parent = _.find(docsJson[directories[0]], function (p) {
                                            return p.name === directories[1];
                                        });

                                        module.name = directories.length === 2 ? directories[1] : file.split('.')[0];

                                        if (directories.length === 2) {
                                            if (!parent) {
                                                docsJson[directories[0]].push(module);
                                            } else {
                                                _.extend(parent, module);
                                            }
                                        } else {
                                            if (!parent) {
                                                parent = {
                                                    name: directories[1]
                                                };
                                                newParent = true;
                                            }

                                            if (!parent[directories[2]]) {
                                                parent[directories[2]] = [];
                                            }

                                            parent[directories[2]].push(module);

                                            if (newParent) {
                                                docsJson[directories[0]].push(parent);
                                            }
                                        }
                                    }

                                    next();
                                })
                                .on('error', function(error){
                                    throw error;
                                });
                            }
                            catch (processError) {
                                console.error('There was an error processing the ' + file + ':');
                                console.log(processError);
                                console.log(processError.stack);
                                return done(processError);
                            }
                        }
                    });
                };

            next();
        });
    };

_.str = require('underscore.string');


process.argv.forEach(function (value, index, flags) {
    if (value === '-t') {
        options.input = './js/docs/test/data';
        options.output = './js/docs/test/docs.json';
        options.pretty = true;
    } else if (value === '-o') {
        options.output = flags[index + 1];
    } else if (value === '-p') {
        options.pretty = true;
    }
});

console.log('options: ' + JSON.stringify(options, null, 4));

console.log('-------------------------------------------------------------');
console.log('processing...');
console.log('-------------------------------------------------------------');
console.log('docs found in:');

walk(options.input, function(error) {
    if (error) {
        throw error;
    } else {
        console.log('-------------------------------------------------------------');

        if (!_.isEmpty(docsJson)) {
            var data;
            if (options.pretty) {
                data = JSON.stringify(docsJson, null, 4);
            } else {
                data = JSON.stringify(docsJson);
            }
            fs.writeFile(options.output, data, 'utf-8', function (error) {
                if (error) {
                    throw error;
                }

                console.log('processing finished and ' + options.output.slice(2) + ' file generated.');
                console.log('-------------------------------------------------------------');
            });
        } else {
            console.log('processing finished and no docs found.');
            console.log('-------------------------------------------------------------');
        }
    }
});