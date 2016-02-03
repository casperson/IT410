var fs = require('fs');
var Promise = require('bluebird');

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

exports.getDirectoryTypes = function(path, depth, filter) {
    var obj = {};
    var promises = [];

    if (depth === undefined) depth = -1;
    if (filter === undefined) {
        filter = function(path, type) { return true; }
    }

    if (typeof depth !== "number") return Promise.reject("Depth must be a number");
    if (typeof filter !== "function") return Promise.reject("Filter must be a function");
    if (typeof path !== "string") return Promise.reject("Path must be a string");

    return exports.getPathType(path)
        .then(function(type) {
            if (type === "directory") {
                return fs.readdir(path, function(err, contents){
                    console.error(err);
                    contents.forEach(function (file) {
                        var filePath = path + "/" + file;
                        var p = exports.getPathType(filePath)
                            .then(function (results) {
                                if (filter(filePath, results)) obj[filePath] = results;
                                if (results === "directory" && depth !== 0) {
                                    return exports.getDirectoryTypes(filePath, depth - 1, filter)
                                        .then(function (res) {
                                            Object.assign(obj, res);
                                        });
                                }
                            });
                        promises.push(p);
                    });
                    return Promise.all(promises)
                        .then(function (obj) {
                            console.log(obj);
                            return(obj);
                        });
                })
            }
            else {
                return Promise.reject("path cannot be directory.");
            }
        });


};

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
    return new Promise(function(resolve, reject) {
        var obj = {};
        var promises = [];

        if (depth === undefined) depth = -1;
        if (typeof depth !== "number") return reject("Depth must be a number");
        if (typeof path !== "string") return reject("Path must be a string");
        if (typeof path === directory) {
            var p = exports.getDirectoryTypes(path, depth)
                .then(function (results) {
                    console.log(results);
                });
            promises.push(p);

            return Promise.all(promises)
                .then(function (obj) {
                    resolve(obj[0]);
                });
        }
        else return reject("Path must be a directory");
    });
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
