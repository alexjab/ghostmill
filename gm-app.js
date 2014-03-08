var express = require ('express');

var ghostmill = require ('./ghostmill.js');

var app = express ();

var server = require ('http').createServer (app);
var io  = require ('./io.js') (server);

var conf = require ('./conf.js');

app
.get ('/:url?/ghostmill.min.js', ghostmill.js)
.get ('/report', express.basicAuth (conf.auth.username, conf.auth.password), ghostmill.report);

server.listen (conf.server.port);

