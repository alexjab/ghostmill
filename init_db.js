var async = require ('async');

var db = require ('./db.js');

var r = require('rethinkdb');
var conn = null;

async.series ([

  function (cb) {
    r.connect ({host: 'localhost', port: 28015}, function (err, connection) {
      conn = connection;
      conn.use('ghostmill');
      cb (err);
    });
  },
  function (cb) {
    r
    .dbCreate ('ghostmill')
    .run (conn, function (err, stats) {
      cb (err, stats);
    });
  },
  function (cb) {
    r
    .db ('ghostmill')
    .tableCreate ('events')
    .run (conn, function (err, stats) {
      cb (err, stats);
    });
  },
  function (cb) {
    r
    .db ('ghostmill')
    .tableCreate ('test_events')
    .run (conn, function (err, stats) {
      cb (err, stats);
    });
  },
  function (cb) {
    r
    .db ('ghostmill')
    .table ('events')
    .indexCreate ('type')
    .run (conn, function (err, stats) {
      cb (err, stats)
    });
  },
  function (cb) {
    r
    .db ('ghostmill')
    .table ('test_events')
    .indexCreate ('type')
    .run (conn, function (err, stats) {
      cb (err, stats)
    });
  }
], function (err, results) {
  if (err) throw Error (err);
  conn.close (function (err) {
    if (err) throw err;
    process.exit (0);
  })
});
