var async = require ('async');
var redis = require ('redis');

var conf = require ('./conf.js');
var db = require ('./db.js');

module.exports = function (express, app, conn) {
  app.get ('/report', express.basicAuth (conf.auth.username, conf.auth.password), function (req, res) {

    async.parallel ({
      views: function (cb) {
        db.get_view_count (conn, cb);
      },
      ticks: function (cb) {
        db.get_tick_count (conn, cb);
      }
    }, function (err, data) {
      res.json (data);
    });
  
  });
};
