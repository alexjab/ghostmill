var redis = require ('redis');

var db = require ('./db.js');

module.exports = function (conn) {

  var event_sub = redis.createClient ();
  event_sub.subscribe ('events');

  event_sub.on ('message', function (channel, message) {
    if (channel === 'events') {
      var msg = JSON.parse (message);
      msg.time = new Date ().getTime ();
      db.insert_event (conn, msg, function (err, stats) {
        null;
      });
    }
  });

};
