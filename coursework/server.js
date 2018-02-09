//load express
var express = require('express');
var app = express();

var port = 8080;

app.get('/', function(req, resp) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port)
console.log('Listening on port: ' + port);
