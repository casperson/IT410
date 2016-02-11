var Promise = require('bluebird');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/user';

exports.createUser = function(username, password) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {

            var collection = db.collection('user');

            collection.find({"user": username}).toArray()
                .then(function (docs) {
                    //collection.deleteMany({});
                    if (docs.length > 0) {
                        resolve("Username taken.");
                    }
                    else {
                        collection.insertOne({"user": username, "password": password})
                            .then(function (result) {
                                resolve("User Created.");
                            })
                            .catch(function (e) {
                                reject(e);
                                console.error("User not created");
                            });
                    }
                })
                .catch(function (e) {
                    return reject(false);
                });


        })
    })

};

exports.changePassword = function(username, newPass) {
    return new Promise(function(resolve, reject) {
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {

            var collection = db.collection('user');

            collection.find({"user": username}).toArray()
                .then(function (docs) {
                    if (docs.length > 0){
                        collection.updateOne({"user": username}, {$set: {"password": newPass}})
                            .then(function (result) {
                                resolve("Password changed successfully!");
                                return result;
                            })
                            .catch(function (e) {
                                reject(e);
                                console.error("Password not changed.");
                            });
                    }
                    else {
                        resolve("Password not changed.");
                    }
                })
                .catch(function (e) {
                    return reject(false);
                });

            collection.findOneAndUpdate({"user": username}, {$set: {"password": newPass}})
                .then(function (result) {
                    resolve("Password changed successfully!");
                    return result;
                })
                .catch(function (e) {
                    reject(e);
                    console.error("Password not changed.");
                });
        });
    })
};

exports.authenticateUser = function(username, password) {
    return new Promise(function(resolve, reject) {
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {

            var collection = db.collection('user');

            collection.find({"user": username, "password": password}).toArray()
                .then(function (docs) {
                    if(docs.length > 0) {
                        resolve("Successfully authenticated!");
                    }
                    else {
                        resolve("Not authenticated.");
                    }
                })
                .catch(function (e) {
                    reject("Not authenticated.");
                    console.error("Not authenticated.");
                });
        });
    })
};