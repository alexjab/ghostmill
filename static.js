var fs = require ('fs');

var async = require ('async');

fs.readFile ('./js_data/all.min.js', function (err, js_data) {
  if (err) throw Error (err);

  var listener = function (sel, _req) {
    return "$('"+sel.sel+"').on('"+sel.e+"',function(){socket.emit('event',{'type':'tick','ip': '"+_req.ip+"', 'url': '"+_req.url+"', 'sel':'"+sel.sel+"','event':'"+sel.e+"'})});";
  };

  var head = "/*\n * made with ktantan.js\n */\n"+js_data+"\nvar socket = io.connect('http://localhost:8000');";

  var get_js_file = exports.get_js_file = function (_req) {
    var sels = [
      {'sel': '#button', 'e': 'click'},
      {'sel': 'a', 'e': 'mouseover'},
      {'sel': '.out', 'e': 'click'}
    ];
    return head+sels.reduce (function (memo, sel) {return memo+listener (sel, _req)}, "");
  };
});

