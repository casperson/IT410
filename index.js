var express = require('express');
var app = express();
var Path = require('path');
var http = require('http');

var directory = process.argv.length < 3 ? process.cwd() : process.argv.splice(2, process.argv.length - 2).join(' ');
console.log(directory);

app.use(express.static(directory));

app.get(directory, function(req, res) {
    res.send("This is the home page");
});

var listener = app.listen(9999, function() {
    console.log("Server started on port " + listener.address().port);
});
