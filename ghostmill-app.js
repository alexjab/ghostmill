var express = require ('express');

var db = require ('./db.js').init (function (err, conn) {
  if (err) {
    throw Error (err);
  } else {
  
    var app = express ();

    var server = require ('http').createServer (app);
    var io  = require ('./io.js') (server);

    var conf = require ('./conf.js');

    var js_file = require ('./js_file.js')(app, conn);
    var js_report = require ('./js_report.js')(express, app, conn);

    server.listen (conf.server.port);

    var core = require ('./ghostmill-core.js')(conn);

  }
});

