var fs = require ('fs');

var async = require ('async');

var db = require ('./db.js');

var conf_path = process.env.NODE_ENV !== 'test'?'':'./test/data/';
var data_path = process.env.NODE_ENV !== 'test'?'./js_data/':'./test/data/';

var conf = require (conf_path+'conf.js');

var _js_data = fs.readFileSync (data_path+'all.min.js');

var get_js_file = exports.get_js_file = function (config, _req) {
  var _head = "/*\n * made with ghostmill.js\n */\n";
  var _socket = ""; 
  if (config.static.use_socketio)
    _socket = "\nvar ghostmill_socket = io.connect('"+conf.server.base_url+"');";
  if (!config.static.use_jquery)
    _js_data = "";
  var _listeners = conf.selectors.reduce (function (memo, sel) {
    return memo + 
      "$('"+sel.sel+"').on('"+sel.e+"',function(){ghostmill_socket.emit('event',{'type':'tick','ip': '"+_req.ip+"', 'url': '"+_req.url+"', 'sel':'"+sel.sel+"','event':'"+sel.e+"'})});";
  }, "");

  return _head + _js_data + _socket + _listeners;
};

