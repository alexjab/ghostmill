var redis = require ('redis');

var client = redis.createClient ();

module.exports = function (server) {
  var io = require ('socket.io').listen (server, { log: false });
  io.sockets.on ('connection', function (socket) {
    socket.on ('event', function (e) {
      client.publish ('events', JSON.stringify (e));
    });
  });
};
