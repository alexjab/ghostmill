var fs = require ('fs');

var _ = require ('underscore');
var async = require ('async');

var db = require ('./db.js');

var conf_path = process.env.NODE_ENV !== 'test'?'':'./test/data/';
var data_path = process.env.NODE_ENV !== 'test'?'./js_data/':'./test/data/';

var conf = require (conf_path+'conf.js');

var jquery_data = fs.readFileSync (data_path+'jquery.min.js');
var socketio_data = fs.readFileSync (data_path+'socket.io.min.js');

var get_js_file = exports.get_js_file = function (config, _req) {
  var head = "/*\n * made with ghostmill.js\n */\n";
  var socket = "";
  var selectors = _.filter (config.site_selectors, function (sel) {return sel.page === _req.url;});
  if (selectors.length > 0) {
    if (!config.static_use_socketio) {
      socketio_data = "";
    }
    if (!config.static_use_jquery) {
      jquery_data = "";
    }

    var gm_object = "var ghostmill={socket:io.connect('"+config.server_base_url+"'),send:function(sel){if("+config.static_debug_mode+"===true)console.log('send');this.socket.emit('event',{'type':'tick','ip': '"+_req.ip+"', 'url': '"+_req.url+"', 'sel':sel.sel,'event':sel.e});}};";
    var listeners = (selectors).reduce (function (memo, sel) {
      return memo +
        "$('"+sel.sel+"').on('"+sel.event+"',function(){ghostmill.send({sel:'"+sel.sel+"', e:'"+sel.event+"'});});";
    }, "");

    return head + jquery_data + socketio_data + gm_object + listeners;
  } else {
    socketio_data = "";
    jquery_data = "";

    return head;
  }

};

