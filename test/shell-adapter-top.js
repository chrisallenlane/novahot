const Config = require('./mock/config');
const Req    = require('./mock/request');
const test   = require('tape');
const top    = require('../app/cmd/shell/adapter-top');

test('shell-adapter-top: should properly structure command (no args)', function(t) {

  top(Config(), Req(), 'top', function(err, response) {
    t.plan(2);
    t.notOk(err);
    t.equals(response.body.cmd, 'top -n1 -b ');
  });

});

test('shell-adapter-top: should properly structure command (with args)', function(t) {

  top(Config(), Req(), 'top -u somebody', function(err, response) {
    t.plan(2);
    t.notOk(err);
    t.equals(response.body.cmd, 'top -n1 -b -u somebody');
  });

});

test('shell-adapter-top: should err on non-200 status code', function(t) {

  top(Config(), Req({ statusCode: 404 }), 'top -u somebody', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
