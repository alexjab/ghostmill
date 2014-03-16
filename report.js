var async = require ('async');
var redis = require ('redis');

var _ = require ('underscore');

var conf = require ('./conf.js');
var db = require ('./db.js');

module.exports = function (express, app, conn) {
  app.get ('/report', express.basicAuth (conf.auth.username, conf.auth.password), function (req, res) {

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
  
  });
};
