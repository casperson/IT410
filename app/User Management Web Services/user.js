var Promise             = require('bluebird');
var mongo               = require('mongodb');
var MongoClient         = require('mongodb').MongoClient;
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

// initialize express app
var app = express();

// Connection URL
var url = 'mongodb://localhost:27017/user';

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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
                    console.log(docs);
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

            //collection.findOneAndUpdate({"user": username}, {$set: {"password": newPass}})
            //    .then(function (result) {
            //        resolve("Password changed successfully!");
            //        return result;
            //    })
            //    .catch(function (e) {
            //        reject(e);
            //        console.error("Password not changed.");
            //    });
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

passport.use(new LocalStrategy(function(username, password, done) {
    exports.authenticateUser(username, password)
        .then(function(response){
            if(response === "Successfully authenticated!") return done(null, { username: username });
            else {return done(null, false);}
        });
}));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

app.get('/services/user',
    function(req, res) {
        if(req.user) return res.send(req.user.username);
    });

app.post('/services/user',
    function(req, res) {
        exports.createUser(req.body.username, req.body.password)
            .then(function(response){
                res.send(response);
            })
            .catch(function(response){
                res.send(response);
            })
    });

app.put('/services/user',
    function(req, res){
        MongoClient.connect(url, function (err, db) {

            var collection = db.collection('user');

            collection.find({"user": req.body.username}).toArray()
                .then(function (docs) {
                    if (docs.length > 0) {
                        console.log(req.user.username, req.body.username);
                        if(req.user.username === req.body.username) {
                            exports.changePassword(req.body.username, req.body.password)
                                .then(function (response) {
                                    res.send(response);
                                })
                                .catch(function (response) {
                                    res.send(response);
                                })
                        }
                    }
                    else {
                        exports.createUser(req.body.username, req.body.password)
                            .then(function(response){
                                res.send(response);
                            })
                            .catch(function(response){
                                res.send(response);
                            })
                    }
                })
                .catch(function (e) {
                    return reject(false);
                });
        });
    });

app.put('/services/login', passport.authenticate('local'),
    function(req, res){
        res.send("Logged in");
    });

app.delete('/services/logout',
    function(req, res){
        req.logout();
    });

var listener = app.listen(3000, function() {
    console.log("Server started on port " + listener.address().port);
});