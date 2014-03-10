var express = require ('express');

var db = require ('./db.js');

db.init (function (err, conn) {
  if (err) throw Error (err);
  
  var app = express ();

  var server = require ('http').createServer (app);
  var io  = require ('./io.js') (server);

  db.get_config (conn, function (err, config) {
    if (err) throw Error (err);
    var js_file = require ('./js_file.js')(app, conn, config);
    var js_report = require ('./js_report.js')(express, app, conn);
  });

  var conf = require ('./conf.js');

  server.listen (conf.server.port);

  var core = require ('./ghostmill-core.js')(conn);

});

