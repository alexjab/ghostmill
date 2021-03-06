var async = require ('async');

var db = require ('./db.js');

var r = require('rethinkdb');
var conn = null;

async.series ([

  function (cb) {
    r.connect ({host: 'localhost', port: 28015}, function (err, connection) {
      conn = connection;
      cb (err);
    });
  },
  function (cb) {
    r
    .dbCreate ('ghostmill')
    .run (conn, function (err, stats) {
      conn.use('ghostmill');
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
    .tableCreate ('config', {'primaryKey': 'key'})
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
  },
  function (cb) {
    r
    .db ('ghostmill')
    .table ('config')
    .insert ([
      {'key': 'static_use_jquery', 'value': true},
      {'key': 'static_use_socketio', 'value': true},
      {'key': 'static_debug_mode', 'value': true},
      {'key': 'site_allowed_pages', 'value': []},
      {'key': 'site_selectors', 'value': []}
    ])
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
