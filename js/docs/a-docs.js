var fs = require('fs'),
    util = require('util'),
    _ = require('underscore');

var walkPath = '../dev',
    outputPath = './docs.json',
    prettyJson = false;

var docsJson = {};

var isEmpty = function (map) {
    for(var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

var walk = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next () {
            var file = list[i++];

            if (!file) {
                return done(null);
            }

            file = dir + '/' + file;

            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    walk(file, function (error) {
                        next();
                    });
                } else {
                    // open file
                    try {
                        fs.createReadStream(file, {
                            encoding: 'utf-8',
                            start: 0,
                            end: 100
                        })
                        .on('data', function(snippet){
                            if (snippet.indexOf('@appular') !== -1) {

                                var data = fs.readFileSync(file, 'utf-8'),
                                    lines,
                                    tagIndex,
                                    datas,
                                    tag,
                                    tagArray,
                                    modified = null,
                                    start,
                                    end = 0,
                                    link,
                                    parent = null,
                                    parentType,
                                    docString,
                                    module = {},
                                    doc = null,
                                    type,
                                    name,
                                    description,
                                    lastImportantTag, // helps determine where to look for @property and @method root objects
                                    docName,
                                    docDefaultArray,
                                    docNameExtends,
                                    param = null,
                                    paramName,
                                    paramDefaultArray,
                                    paramNameExtends,
                                    blankDefine,
                                    homeDir;

                                while (data.indexOf('/**', end) !== -1) {
                                    // find doc name and type from first doc
                                    start = data.indexOf('/**', end),
                                    end = data.indexOf('*/', start) + 2;
                                    
                                    // extract first documentation section
                                    docString = data.slice(start, end);

                                    // make sure tag includes @appular or @doc to prevent other comment styles breaking build
                                    if (docString.indexOf('@appular') !== -1 || docString.indexOf('@doc') !== -1) {

                                        // split into individual lines
                                        lines = docString.split('\n');

                                        for (var i = 0; i < lines.length; i++) {
                                            // find the @
                                            tagIndex = lines[i].indexOf('@');
                                            
                                            // if @ exists we are in business
                                            if (tagIndex !== -1) {
                                                // create array of data
                                                datas = lines[i].slice(tagIndex).split(' ');
                                                
                                                // get tag
                                                tag = datas.shift().slice(1);

                                                // check if tag has modified date
                                                if (tag.indexOf(':')) {
                                                    tagArray = tag.split(':');
                                                    tag = tagArray.shift();
                                                    modified = tagArray.shift();
                                                } else {
                                                    modified = null;
                                                }

                                                switch (tag) {
                                                    case 'appular':
                                                        // add modified date if available
                                                        if (modified) {
                                                            module.modified = modified;
                                                        }

                                                        // set appular type if set and default to misc
                                                        if (datas[0].indexOf('{') !== -1) {
                                                            type = datas.shift().slice(1, -1);
                                                        } else {
                                                            type = 'misc';
                                                        }
                                                        
                                                        // set name
                                                        name = datas.shift();

                                                        // see if description exists
                                                        if (datas[0] === '-') {
                                                            // get rid of dash
                                                            datas.shift();
                                                            module.description = datas.join(' ');
                                                        } else {
                                                            module.description = '';
                                                        }

                                                        // set file path
                                                        module.file = file.slice(2);

                                                        // reset parent
                                                        parent = null;
                                                        break;
                                                    case 'extends':
                                                        module['extends'] = datas.join(' ');
                                                        break;
                                                    case 'call':
                                                        module['call'] = datas.join(' ');
                                                        break;
                                                    case 'define':
                                                        module.define = datas.shift();
                                                        break;
                                                    case 'parent':
                                                        // set appular type if set and default to misc
                                                        if (datas[0].indexOf('{') !== -1) {
                                                            parentType = datas.shift().slice(1, -1);
                                                        } else {
                                                            parentType = 'misc';
                                                        }
                                                        //set parent name
                                                        parent = datas.shift();
                                                        break;
                                                    case 'link':
                                                        link = {};

                                                        // set link url
                                                        link.url = datas.shift();

                                                        // see if description exists
                                                        if (datas[0] === '-') {
                                                            // get rid of dash
                                                            datas.shift();
                                                            link.description = datas.join(' ');
                                                        }

                                                        // add to module.  module can have more than one link so it is an array
                                                        module.links = module.links || [];
                                                        module.links.push(link);
                                                        break;
                                                    case 'doc':
                                                        doc = {
                                                            description: ''
                                                        };

                                                        // add modified date if available
                                                        if (modified) {
                                                            doc.modified = modified;
                                                        }
                                                        
                                                        // see if type was supplied
                                                        if (datas[0].indexOf('{') !== -1) {
                                                            doc.type = datas.shift().slice(1, -1);
                                                        }
                                                        
                                                        // set name
                                                        docName = datas.shift();

                                                        // see if default was supplied
                                                        if (docName.indexOf('=') !== -1) {
                                                            // split name and default
                                                            docDefaultArray = docName.split('=');
                                                            docName = docDefaultArray.shift();
                                                            doc['default'] = docDefaultArray.shift();
                                                        }

                                                        // see if name has . in it indicating it is extending another tag
                                                        if (docName.indexOf('.') !== -1) {
                                                            docNameExtends = docName.split('.');
                                                            docName = docNameExtends.pop();
                                                        }

                                                        // the rest is desctiption
                                                        if (datas.length > 0) {
                                                            // remove the dash
                                                            datas.shift();
                                                            // create description string
                                                            doc.description = datas.join(' ');
                                                        }
                                                        break;
                                                    case 'param':
                                                    case 'return':
                                                    case 'property':
                                                    case 'method':
                                                        param = {
                                                            description : ''
                                                        },
                                                        paramNameExtends = [];
                                                        
                                                        // see if type was supplied
                                                        if (datas[0].indexOf('{') !== -1) {
                                                            param.type = datas.shift().slice(1, -1);
                                                        }
                                                        // set name
                                                        paramName = datas.shift();

                                                        // see if default was supplied
                                                        if (paramName.indexOf('=') !== -1) {
                                                            // split name and default
                                                            paramDefaultArray = paramName.split('=');
                                                            paramName = paramDefaultArray.shift();
                                                            param['default'] = paramDefaultArray.shift();
                                                        }

                                                        // see if name has . in it indicating it is extending another tag
                                                        if (paramName.indexOf('.') !== -1) {
                                                            paramNameExtends = paramName.split('.');
                                                            paramName = paramNameExtends.pop();
                                                        }

                                                        // see if paramName is optional was supplied
                                                        if (paramName.indexOf('[') !== -1) {
                                                            paramName = paramName.slice(1, -1);
                                                            param.isOptional = true;
                                                        } else {
                                                            param.isOptional = false;
                                                        }

                                                        // the rest is desctiption
                                                        if (datas.length > 0) {
                                                            // remove the dash
                                                            datas.shift();
                                                            // create description string
                                                            param.description = datas.join(' ');
                                                        }
                                                        
                                                        // add to doc
                                                        if (tag === 'param' || tag === 'return') {
                                                            // returns aren't optional
                                                            if (tag === 'return') {
                                                                delete param.isOptional;
                                                            }

                                                            if (doc.type === 'function') {
                                                                if (!_.isEmpty(paramNameExtends)) {
                                                                    if (paramNameExtends.length === 1) {
                                                                        doc['param'][paramNameExtends[0]][tag] = doc['param'][paramNameExtends[0]][tag] || {};
                                                                        doc['param'][paramNameExtends[0]][tag][paramName] = param;
                                                                    } else if (paramNameExtends.length === 2) {
                                                                        doc['param'][paramNameExtends[0]]['method'][paramNameExtends[1]][tag] = doc['param'][paramNameExtends[0]]['method'][paramNameExtends[1]][tag] || {};
                                                                        doc['param'][paramNameExtends[0]]['method'][paramNameExtends[1]][tag][paramName] = param;
                                                                    }
                                                                } else {
                                                                    doc[tag] = doc[tag] || {};
                                                                    doc[tag][paramName] = param;
                                                                }
                                                            } else if (doc.type === 'event') {
                                                                doc[tag] = doc[tag] || {};
                                                                doc[tag][paramName] = param;
                                                            } else {
                                                                // doc is object so parent will be in method
                                                                doc['method'][paramNameExtends[0]][tag] = doc['method'][paramNameExtends[0]][tag] || {};
                                                                doc['method'][paramNameExtends[0]][tag][paramName] = param;
                                                            }

                                                            lastImportantTag = tag;

                                                        } else if (tag === 'property' || tag === 'method') {
                                                            
                                                            if (doc.type === 'function') {
                                                                // our object will be found in params or return
                                                                if (param.type === 'function') {
                                                                    // put in methods
                                                                    doc[lastImportantTag][paramNameExtends[0]]['method'] = doc[lastImportantTag][paramNameExtends[0]]['method'] || {};
                                                                    doc[lastImportantTag][paramNameExtends[0]]['method'][paramName] = param;
                                                                } else {
                                                                    // put in properties
                                                                    doc[lastImportantTag][paramNameExtends[0]]['property'] = doc[lastImportantTag][paramNameExtends[0]]['property'] || {};
                                                                    doc[lastImportantTag][paramNameExtends[0]]['property'][paramName] = param;
                                                                }
                                                            } else {
                                                                // our doc is an object
                                                                delete param.isOptional;

                                                                if (param.type === 'function') {
                                                                    // put in methods
                                                                    doc['method'] = doc['method'] || {};
                                                                    doc['method'][paramName] = param;
                                                                } else {
                                                                    // put in properties
                                                                    doc.property = doc.property || {};
                                                                    doc.property[paramName] = param;
                                                                }
                                                            }
                                                        }
                                                        break;
                                                }
                                            }
                                        }

                                        // individual doc done
                                        if (doc) {
                                            // make sure module docs exists
                                            module.doc = module.doc || {};

                                            // add straight to module unless it is event
                                            if (doc.type === 'event') {
                                                module.doc['event'] = module.doc['event'] || {};
                                                module.doc['event'][docName] = doc;
                                            } else {
                                                module.doc[docName] = doc;
                                            }
                                            // reset doc object
                                            doc = null;
                                        }
                                        lastImportantTag = '';
                                    }
                                }
                                // all docs done

                                // if define isn't set set it using file
                                if (!module.define) {
                                    blankDefine = module.file.slice(1, -3);
                                    blankDefine = blankDefine.split('/');
                                    blankDefine.shift();
                                    module.define = blankDefine.join('/');
                                }

                                // add to main docsJson
                                if (parent) {
                                    docsJson[parentType] = docsJson[parentType] || {};
                                    docsJson[parentType][parent] = docsJson[parentType][parent] || {};
                                    docsJson[parentType][parent]['child'] = docsJson[parentType][parent]['child'] || {};
                                    docsJson[parentType][parent]['child'][type] = docsJson[parentType][parent]['child'][type] || {};
                                    docsJson[parentType][parent]['child'][type][name] = docsJson[parentType][parent]['child'][type][name] || {};
                                    _.extend(docsJson[parentType][parent]['child'][type][name], module);
                                } else {
                                    docsJson[type] = docsJson[type] || {};
                                    docsJson[type][name] = docsJson[type][name] || {};
                                    _.extend(docsJson[type][name], module);
                                }

                                console.log(file.slice(2));
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
        })();
    });
};

process.argv.forEach(function (val, index, array) {
    if (val.indexOf('useTestData') !== -1) {
        if (val.indexOf('true') !== -1) {
            walkPath = './test/data';
            outputPath = './test/output.json';
            prettyJson = true;
        }
    } else if (val.indexOf('output') !== -1) {
        outputPath = val.split('=')[1];
    }
});

console.log('-------------------------------------------------------------');
console.log('processing...');
console.log('-------------------------------------------------------------');
console.log('docs found in:');

walk(walkPath, function(error) {
    if (error) {
        throw error;
    } else {
        console.log('-------------------------------------------------------------');

        if (!isEmpty(docsJson)) {
            var data;
            if (prettyJson) {
                data = JSON.stringify(docsJson, null, 4);
            } else {
                data = JSON.stringify(docsJson);
            }
            fs.writeFile(outputPath, data, 'utf-8', function (error) {
                if (error) {
                    throw error;
                }

                console.log('processing finished and ' + outputPath.slice(2) + ' file generated.');
                console.log('-------------------------------------------------------------');
            });
        } else {
            console.log('processing finished and no docs found.');
            console.log('-------------------------------------------------------------');
        }
    }
});