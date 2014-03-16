var _ = require ('underscore');
var async = require ('async');
var r = require('rethinkdb');

var event_tbl = process.env.NODE_ENV === 'test'?'test_events':'events';
var conf_tbl = process.env.NODE_ENV === 'test'?'test_config':'config';

exports.init = function (callback) {
  r.connect ({host: 'localhost', port: 28015, db: 'ghostmill'}, function (err, connection) {
    if (!err) {
      conn = connection;
    }
    callback (err, conn);
  });
};

var get_view_count_unique = exports.get_view_count_unique = function (conn, cb) {
  var acc = {};
  r
  .table (event_tbl)
  .getAll ("view", {index: "type"})
  .pluck ("ip", "url")
  .distinct ()
  .groupBy ("url", r.count)
  .run (conn, function (err, cursor) {
    if (err) {
      cb (err);
    } else {
      cursor.each (function (err, data) {
        if (err) {
          cb (err);
          cursor.close ();
          return false;
        } else {
          acc[data.group.url] = data.reduction;
        }
      }, function () {
        cb (null, acc);
      });
    }
  });
};

var get_view_count = exports.get_view_count = function (conn, cb) {
  var acc = {};
  r
  .table (event_tbl)
  .getAll ("view", {index: "type"})
  .pluck ("ip", "url")
  .groupBy ("url", r.count)
  .run (conn, function (err, cursor) {
    if (err) {
      cb (err);
    } else {
      cursor.each (function (err, data) {
        if (err) {
          cb (err);
          cursor.close ();
          return false;
        } else {
          acc[data.group.url] = data.reduction;
        }
      }, function () {
        cb (null, acc);
      });
    }
  });
};

var get_tick_count = exports.get_tick_count = function (conn, cb) {
  var acc = {};
  r
  .table (event_tbl)
  .getAll ("tick", {index: "type"})
  .pluck ("ip", "url", "sel", "event")
  .map (function (row){ return {'url': row ('url'), 'event': row ('event'), 'sel': row ('sel')};})
  .run (conn, function (err, cursor){
    if (err) {
      cb (err);
    } else {
      cursor.each (function (err, val) {
        if (err) {
          cb (err);
          val.close ();
          return false;
        } else {
          if (!acc[val.url]) {
            acc[val.url] = {};
          }
          if (!acc[val.url][val.event+' '+val.sel]) {
            acc[val.url][val.event+' '+val.sel] = 0;
          }
          acc[val.url][val.event+' '+val.sel] += 1;
        }
      }, function () {
        cb (null, acc);
      });
    }
  });
};

var insert_event = exports.insert_event = function (conn, _event, cb) {
  r
  .table (event_tbl)
  .insert (_event)
  .run (conn, function (err, stats) {
    cb (err, stats);
  });
};

var get_config = exports.get_config = function (conn, cb){
  r
  .table (conf_tbl)
  .run (conn, function (err, cursor) {
    if (err) {
      cb (err);
    } else {
      var config = {};
      cursor.each (function (err, c) {
        if (config[c.major] === undefined) {
          config[c.major] = {};
        }
        config[c.major][c.minor] = c.value;
      }, function () {
        cb (err, config);
      });
    }
  });
};

var _get_event = exports._get_event = function (conn, id, cb) {
  r
  .table (event_tbl)
  .get (id)
  .run (conn, function (err, _event) {
    cb (err, _event);
  });
};

var _empty_test_table = exports._empty_test_table = function (conn, cb) {
  r
  .table (event_tbl)
  .delete ()
  .run (conn, function (err, stats) {
    cb (err, stats);
  });
};
