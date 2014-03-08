var fs = require ('fs');

var async = require ('async');

var conf = require ('./conf.js');

fs.readFile ('./js_data/all.min.js', function (err, js_data) {
  if (err) throw Error (err);

  var listener = function (sel, _req) {
    return "$('"+sel.sel+"').on('"+sel.e+"',function(){socket.emit('event',{'type':'tick','ip': '"+_req.ip+"', 'url': '"+_req.url+"', 'sel':'"+sel.sel+"','event':'"+sel.e+"'})});";
  };

  var head = "/*\n * made with ghostmill.js\n */\n"+js_data+"\nvar socket = io.connect('"+conf.server.base_url+"');";

  var get_js_file = exports.get_js_file = function (_req) {
    var sels = conf.selectors;
    return head+sels.reduce (function (memo, sel) {return memo+listener (sel, _req)}, "");
  };
});

