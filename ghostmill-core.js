var colors = require('colors');
var redis = require ('redis');

var db = require ('./db.js');

module.exports = function (emitter) {

  var conn;
  emitter.on ('connection', function (_conn) {conn = _conn;});

  var event_sub = redis.createClient ();
  event_sub.subscribe ('events');

  event_sub.on ('message', function (channel, message) {
  if (!conn) {
    console.log ('[ghostmill-core.js]:'.grey, 'Server not ready ✖'.red);
  } else {
    if (channel === 'events') {
      var msg = JSON.parse (message);
      msg.time = new Date ().getTime ();
      db.insert_event (conn, msg, function (err, stats) {
        null;
      });
    }
  }
  });

};
