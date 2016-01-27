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
        if (depth === undefined) depth = -1;
        if (filter === undefined) {
            filter = function(path, type) { return true; }
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

    });
};

exports.readFile = function(path) {
    return new Promise(function(resolve, reject) {
        if(typeof path !== "string" || )
    });
};

exports.readFiles = function(paths) {
    return new Promise(function(resolve, reject) {

    });
};