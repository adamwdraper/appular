var fs = require('fs'),
    util = require('util'),
    _ = require('underscore'),
    options = {
        pretty: false,
        output: './js/docs/docs.json',
        input: './js/dev'
    },
    tags = [
        'appular',
        'extends',
        'define',
        'link',
        'function',
        'event'
    ],
    docsJson = {};

_.str = require('underscore.string');

var walk = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0,
            next = function () {
                var file = list[i++],
                    path;

                if (!file) {
                    return done(null);
                }

                path = dir + '/' + file;

                fs.stat(path, function (error, stat) {

                    if (stat && stat.isDirectory()) {
                        walk(path, function (error) {
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
                                    module;

                                if (snippet.indexOf('@appular') !== -1) {
                                    data = fs.readFileSync(path, 'utf-8');

                                    // log file path
                                    console.log(path.slice(2));

                                    // begin module definition
                                    module = {
                                        name: file
                                    };

                                    // gets all multi line comments in file
                                    comments = data.match(/\/\*+([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//gm);

                                    _.each(comments, function (comment) {
                                        var doc = {};
                                        // extracts all tags
                                        doc.lines = comment.match(/(@.*[^\r\n])/g);

                                        // _.each(doc.lines, function (line) {
                                            
                                        // });

                                    });

                                    console.log(module);

                                    // while (data.indexOf('/**', end) !== -1) {
                                    //     // find doc name and type from first doc
                                    //     start = data.indexOf('/**', end),
                                    //     end = data.indexOf('*/', start) + 2;

                                    //     // extract first documentation section
                                    //     doc.data = data.slice(start, end);

                                    //     // split into individual lines
                                    //     doc.lines.push({
                                    //         data: doc.data.split('\n')
                                    //     });

                                    //     for (i = 0; i < doc.lines.length; i++) {
                                    //         // create array of data
                                    //         doc.lines[i].parts = _.str.trim(doc.lines[i].data).split(' ');

                                    //         // get tag
                                    //         doc.lines[i].tag = doc.lines[i]..parts.shift().slice(1);

                                    //         switch (line.tag) {
                                    //             case 'appular':

                                    //                 break;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // // all docs done

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

process.argv.forEach(function (value, index, flags) {
    if (value === '-t') {
        options.input = './js/docs/test/data';
        options.output = './js/docs/test/output.json';
        options.pretty = true;
    } else if (value === '-o') {
        options.output = flags[index + 1];
    } else if (value === '-p') {
        options.pretty = true;
    }
});

console.log(options);

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