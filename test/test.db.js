var async = require ('async');
var should = require ('should');

var db = require ('../db.js');

describe ('db.js', function () {

  describe ('insert_event ()', function () {
    it ('should insert an event in the db', function (done) {
      var e = {'type': 'view', 'ip': '1.2.3.4', 'url': '/test_insert_event', 'time': new Date ().getTime ()};
      db.insert_event (e, function (err, stats) {
        (err === null).should.be.true;
        stats.inserted.should.be.above (0);
        stats.generated_keys.length.should.be.above (0);
        db._get_event (stats.generated_keys[0], function (err, inserted_event) {
          e.id = stats.generated_keys[0];
          inserted_event.should.eql (e);
          done ();
        });
      });
    });
  });

  describe ('get_view_count ()', function () {
    it ('should return a formatted page view count', function (done) {
      var _type = 'view', _ip = '1.2.3.4', _url = '/views', _time = new Date ().getTime ();
      async.each ([
        {'type': _type, 'ip': _ip, 'url': _url, 'time': _time},
        {'type': _type, 'ip': _ip, 'url': _url, 'time': _time},
        {'type': _type, 'ip': _ip, 'url': _url+'2', 'time': _time},
        {'type': _type, 'ip': '1.2.3.5', 'url': _url, 'time': _time},
        {'type': _type, 'ip': '1.2.3.5', 'url': _url+'2', 'time': _time}
      ], function (e, cb) {
        db.insert_event (e, function (err, stats) {
          cb (err, stats);
        });
      }, function (err) {
        (err === null).should.be.true;
        db.get_view_count (function (err, actual) {
          (err === null).should.be.true;
          actual.should.have.property (_url).with.equal (2);
          actual.should.have.property (_url+'2').with.equal (2);
          done ();
        });
      });
    });
  });

  describe ('get_tick_count ()', function () {
    it ('should return formatted tick list counts', function (done) {
      var _type = 'tick', _ip = '1.2.3.4', _url = '/ticks', _sel = '#this-btn', _event = 'click', _time = new Date ().getTime ();
      
      async.each ([
        {'type': _type, 'ip': _ip, 'url': _url, 'sel': _sel, 'event': _event, 'time': _time},
        {'type': _type, 'ip': _ip, 'url': _url, 'sel': _sel, 'event': _event, 'time': _time},
        {'type': _type, 'ip': _ip, 'url': _url, 'sel': '.img', 'event': 'mouseover', 'time': _time},
        {'type': _type, 'ip': '1.2.3.5', 'url': _url, 'sel': _sel, 'event': _event, 'time': _time},
        {'type': _type, 'ip': '1.2.3.5', 'url': _url+'2', 'sel': _sel, 'event': _event, 'time': _time}
      ], function (e, cb) {
        db.insert_event (e, function (err, stats) {
          cb (err, stats);
        });
      } , function (err, stats) {
        (err === null).should.be.true;
        db.get_tick_count (function (err, actual) {
          (err === null).should.be.true;
          actual.should.have.property (_url).with.have.property (_event+' '+_sel).with.equal (2);
          actual.should.have.property (_url+'2').with.have.property (_event+' '+_sel).with.equal (1);
          actual.should.have.property (_url).with.have.property ('mouseover .img').with.equal (1);
          done ();
        });
      });
    });
  });

});
