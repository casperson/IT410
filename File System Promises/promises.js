var fs = require('fs');
var Promise = require('bluebird');
var Path = require('path');

exports.getPathType = function(path) {
    return new Promise(function(resolve, reject) {
        if (typeof path === "string") {
            fs.stat(path, function (err, stats) {
                if (err) {
                    resolve("nothing");
                }
                else if (stats.isFile()) {
                    resolve("file");
                }
                else if (stats.isDirectory()) {
                    resolve("directory");
                }
                else {
                    resolve("other");
                }
            })
        }
        else {
            reject("Path not passed as a string");
        }
    });
};

exports.readdir = function(path) {
    return exports.getPathType(path)
        .then(function(type) {
            if (type !== 'directory') throw Error('Not a directory');
            return new Promise(function(resolve, reject) {
                fs.readdir(path, function(err, files) {
                    if (err) return reject(err);
                    return resolve(files);
                });
            });
        });
};

exports.getDirectoryTypes = function(path, depth, filter) {
    var result = {};

    if (arguments.length < 2) depth = -1;
    if (arguments.length < 3) filter = function() { return true };

    if (typeof depth !== "number") return Promise.reject("Depth must be a number");
    if (typeof filter !== "function") return Promise.reject("Filter must be a function");
    if (typeof path !== "string") return Promise.reject("Path must be a string");

    return exports.readdir(path)
        .then(function(files) {
            var promises = [];
            files.forEach(function(file) {
                var fullPath = Path.resolve(path, file);
                var promise = exports.getPathType(fullPath)
                    .then(function(type) {
                        if (filter(fullPath, type)) result[fullPath] = type;
                        if (type === 'directory' && depth !== 0) {
                            return exports.getDirectoryTypes(fullPath, depth - 1, filter)
                                .then(function(map) {
                                    Object.assign(result, map);
                                });
                        }
                    });
                promises.push(promise);
            });
            return Promise.all(promises)
                .then(function() {
                    return result;
                });
        });
}

exports.exists = function(path) {
    return new Promise(function(resolve, reject) {
        if (typeof path === "string") {
            exports.getPathType(path)
                .then(function(results) {
                    if(results === "nothing"){
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                })
                .catch(function(err) {
                    throw err;
                })
        }
        else {
            reject("Path not passed as a string");
        }
    });
};

exports.getFilePaths = function(path, depth) {
    return exports.getDirectoryTypes(path, depth, function(path, type){
            return type ==='file';
        })
        .then(function(resolution){
            return Object.keys(resolution);
        })
};

exports.readFile = function(path) {
    return new Promise(function(resolve, reject) {
        if(typeof path === "string") {
            fs.readFile(path, 'utf8', function(err, data) {
                if(err){
                    if(err.code === "ENOENT"){
                        reject("No such file or directory");
                    }
                    else {reject(err)}
                }
                else {
                    resolve(data);
                }
            })
        }
        else {
            reject("Path not passed as a string");
        }
    });
};

exports.readFiles = function(paths) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(paths)) reject("Must pass in an array.");
        var promises = [];
        var obj = {};
        paths.forEach(function(path) {
            var p = new Promise(function(resolve2, reject2){
                exports.readFile(path)
                    .then(function(results){
                        obj[path] = results;
                        resolve2(obj);
                    })
                    .catch(function(err){
                        reject("One or more files could not be read.");
                    })
            });
            promises.push(p);
        });
        return Promise.all(promises)
            .then(function (obj) {
                resolve(obj[0]);
            });
    });
};
