var async = require ('async');
var redis = require ('redis');

var _static = require ('./static');
var db = require ('./db.js');

var client = redis.createClient ();

var js = exports.js = function (req, res) {
  var req_url = req.params.url || '/';
  var req_ip = req.ip;

  res.set('Content-Type', 'text/javascript');
  res.send (_static.get_js_file ({'ip': req_ip, 'url': req_url}));

  var e = {'type': 'view', 'ip': req_ip, 'url': req_url};
  client.publish ('events', JSON.stringify (e));
};

var report = exports.report = function (req, res) {
  async.parallel ({
    views: function (cb) {
      db.get_view_count (cb);
    },
    ticks: function (cb) {
      db.get_tick_count (cb);
    }
  }, function (err, data) {
    res.json (data);
  });
};

var dev = exports.dev = function (req, res) {
  db.get_views_by_url (function (err, data) {
    if (err)
      res.send (err);
    else
      res.send (data);
  });
};

