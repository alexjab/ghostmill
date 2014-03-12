var _ = require ('underscore');
var async = require ('async');
var redis = require ('redis');

var db = require ('./db.js');

module.exports = function (app, conn, config) {

  var _static = require ('./static');

  var client = redis.createClient ();

  app.get ('/:url?/ghostmill.min.js', function (req, res) {
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
  });

};
