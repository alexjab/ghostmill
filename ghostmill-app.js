var _ = require ('underscore');
var express = require ('express');

var db = require ('./db.js');
var conf = require ('./conf.js');

var emitter = require ('./emitter.js');

db.init (function (err, conn) {
  if (err) throw Error (err);
  emitter.emit ('connection', conn);
  console.log ('[ghostmill-app.js]:'.grey, 'The connection to the database has been established ✓'.green);
  db.get_config (conn, function (err, config) {
    if (err) throw Error (err);
    emitter.emit ('configuration', config);
    console.log ('[ghostmill-app.js]:'.grey, 'The configuration has been loaded ✓'.green);
  });
});

var app = express ();
app.locals._ = _;
app.use ('/static/views', express.static ('./static/views'));
app.use ('/static/js', express.static ('./static/js'));
app.use ('/static/css', express.static ('./static/css'));
app.set ('views', './static/views');
app.set ('view engine', 'ejs');

var ghostmill = require ('./ghostmill.js');
ghostmill.init (emitter);

app.get ('/:url?/ghostmill.min.js', ghostmill.js_file);
app.get ('/report', express.basicAuth (conf.auth.username, conf.auth.password), ghostmill.report);

var server = require ('http').createServer (app);
var io  = require ('./io.js') (server);

server.listen (conf.server.port);

var core = require ('./ghostmill-core.js')(emitter);

