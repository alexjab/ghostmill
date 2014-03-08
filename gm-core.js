var redis = require ('redis');
var r = require('rethinkdb');

var event_sub = redis.createClient ();
event_sub.subscribe ('events');

var conn = null;
r.connect ({host: 'localhost', port: 28015}, function (err, connection) {
  if (err) throw err;
  conn = connection;
  conn.use('ktantan');
});

event_sub.on ('message', function (channel, message) {
  if (channel === 'events') {
    var msg = JSON.parse (message);
    msg.time = new Date ().getTime ();
    r.table ('events').insert (msg).run (conn, function (err, stats) {
      null;
    });
  }
});

