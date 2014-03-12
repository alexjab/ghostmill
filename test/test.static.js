var should = require ('should');

var _static = require ('../static.js')

describe ('static.js', function () {
  describe ('get_js_file', function () {
    it ('should return a javascript file', function (done) {
      var config = {'static': {'use_socketio': true, 'use_jquery': true}};
      var _req = {'ip': '4.8.15.16', 'url': '/instant_karma'};
      var actual = _static.get_js_file (config, _req);
      expected = 
      "/*\n * made with ghostmill.js\n */\nconsole.log ('test stuff !');\n\nvar ghostmill_socket = io.connect('http://localhost:8000');$('#button').on('click',function(){ghostmill_socket.emit('event',{'type':'tick','ip': '4.8.15.16', 'url': '/instant_karma', 'sel':'#button','event':'click'})});$('.img').on('mouseover',function(){ghostmill_socket.emit('event',{'type':'tick','ip': '4.8.15.16', 'url': '/instant_karma', 'sel':'.img','event':'mouseover'})});";
      actual.should.equal (expected);
      done ();
    });
  });
});
