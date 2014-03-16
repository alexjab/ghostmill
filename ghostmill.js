var _ = require ('underscore');
var async = require ('async');
var redis = require ('redis');

var db = require ('./db.js');
var _static = require ('./static.js');

var conn, config;
var client = redis.createClient ();

var init = exports.init = function (emitter) {
  emitter.on ('connection', function (_conn) {conn = _conn;});
  emitter.on ('configuration', function (_config) {config = _config;});
};

var js_file = exports.js_file = function (req, res) {
  if (!conn || !config) {
    res.send (503, 'Server not ready');
  } else {
    var req_url = req.params.url || '/';
    if (_.indexOf ((config.sites.pages || []), req_url) > -1) {
      var req_ip = req.ip;

      res.set('Content-Type', 'text/javascript');
      res.send (_static.get_js_file (config, {'ip': req_ip, 'url': req_url}));

      var e = {'type': 'view', 'ip': req_ip, 'url': req_url};
      client.publish ('events', JSON.stringify (e));
    } else {
      res.send (404, 'Not found.');
    }
  }
};

var report = exports.report = function (req, res) {
  if (!conn) {
    res.send (503, 'Server not ready');
  } else {
    async.parallel ({
      views: function (cb) {
        async.parallel ({
          unique: function (cb) {
            db.get_view_count_unique (conn, cb);
          }, total: function (cb) {
            db.get_view_count (conn, cb);
          }
        }, function (err, data) {
          var results = _.reduce (data.unique, function (memo, value, key) {
            memo[key] = (memo[key] !== undefined)?_.extend (memo[key], {'total': value}):{'unique': value};
            return memo;
          }, {});
          results = _.reduce (data.total, function (memo, value, key) {
            memo[key] = (memo[key] !== undefined)?_.extend (memo[key], {'total': value}):{'total': value};
            return memo;
          }, results);
          cb (err, results);
        });
      }, ticks: function (cb) {
        db.get_tick_count (conn, cb);
      }
    }, function (err, data) {
      data.total = _.reduce (data.views,
        function (memo, value, key) {
          memo.unique += value.unique;
          memo.total += value.total;
          return memo;
        }, {'unique': 0, 'total': 0});
      res.render ('report', {data: data});
    });
  }
}
