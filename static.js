var fs = require ('fs');

var async = require ('async');

var db = require ('./db.js');

var conf_path = process.env.NODE_ENV !== 'test'?'':'./test/data/';
var data_path = process.env.NODE_ENV !== 'test'?'./js_data/':'./test/data/';

var conf = require (conf_path+'conf.js');

var _jquery_data = fs.readFileSync (data_path+'jquery.min.js');
var _socketio_data = fs.readFileSync (data_path+'socket.io.min.js');

var get_js_file = exports.get_js_file = function (config, _req) {
  var _head = "/*\n * made with ghostmill.js\n */\n";
  var _socket = ""; 
  if ((config.sites.selectors || []).length > 0) {
    _socket = "\nvar ghostmill_socket = io.connect('"+conf.server.base_url+"');";
    if (!config.static.use_socketio) {
      _socketio_data = "";
    }
    if (!config.static.use_jquery) {
      _jquery_data = "";
    }
  } else {
    _socketio_data = "";
    _jquery_data = "";
  }
  var _listeners = (config.sites.selectors||[]).reduce (function (memo, sel) {
    return memo + 
      "$('"+sel.sel+"').on('"+sel.e+"',function(){ghostmill_socket.emit('event',{'type':'tick','ip': '"+_req.ip+"', 'url': '"+_req.url+"', 'sel':'"+sel.sel+"','event':'"+sel.e+"'})});";
  }, "");

  return _head + _jquery_data + _socketio_data + _socket + _listeners;
};

