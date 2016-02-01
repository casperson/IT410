var fs = require('fs');

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
    return new Promise(function(resolve, reject) {
        var obj = {};
        var promises = [];

        if (depth === undefined) depth = -1;
        if (filter === undefined) {
            filter = function(path, type) { return true; }
        }

        if (typeof depth !== "number") reject("Depth must be a number");
        if (typeof filter !== "function") reject("Filter must be a function");
        if (typeof path !== "string") reject("Path must be a string");

        fs.readdir(path, function (err, contents) {
            contents.forEach(function (file) {
                var filePath = path + "/" + file;
                var p = new Promise(function(resolve2, reject2) {
                    exports.getPathType(filePath)
                        .then(function (results) {
                            if (filter(filePath, results) === true) {
                                obj[filePath] = results;
                            }
                            if (depth !== 0) {
                                return exports.getDirectoryTypes(file, depth - 1, filter)
                                    .then(function (res) {
                                        Object.assign(obj, res);
                                        resolve2(obj);
                                    });
                            }
                        });
                });
                promises.push(p);
            })
        });

        Promise.all(promises)
            .then(function (obj) {
                resolve(obj);
            })
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
        if (typeof depth !== "number") reject("Depth must be a number");
        if (typeof path !== "string") reject("Path must be a string");

        var p = exports.getDirectoryTypes(path, depth)
            .then(function (results) {
                console.log(results);
            });
        promises.push(p);

        Promise.all(promises)
            .then(function (obj) {
                resolve(obj[0]);
            });
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
        Promise.all(promises)
            .then(function (obj) {
                resolve(obj[0]);
            });
    });
};
