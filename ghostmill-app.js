var _ = require ('underscore');
var express = require ('express');

var db = require ('./db.js');
var conf = require ('./conf.js');

db.init (function (err, conn) {
  if (err) throw Error (err);
  
  var app = express ();
  app.locals._ = _;
  app.use ('/static/views', express.static ('./static/views'));
  app.use ('/static/js', express.static ('./static/js'));
  app.use ('/static/css', express.static ('./static/css'));
  app.set ('views', './static/views');
  app.set ('view engine', 'ejs');

  db.get_config (conn, function (err, config) {
    if (err) throw Error (err);
    var js_file = require ('./js_file.js')(app, conn, config);
    var js_report = require ('./js_report.js')(express, app, conn);
  });

  var server = require ('http').createServer (app);
  var io  = require ('./io.js') (server);

  server.listen (conf.server.port);

  var core = require ('./ghostmill-core.js')(conn);

});

