const Config  = require('./mock/config');
const Req     = require('./mock/request');
const payload = require('../app/cmd/shell/adapter-payload');
const test    = require('tape');

test('shell-adapter-payload: should send payload commands (no args)', function(t) {

  payload(Config(), Req(), 'payload_custom', function(err, response) {
    t.plan(4);
    t.notOk(err);
    t.ok(response.body);
    t.equals(response.body.cmd, 'payload_custom');
    t.equals(Object.keys(response).length, 1);
  });

});

test('shell-adapter-payload: should send payload commands (args)', function(t) {

  payload(Config(), Req(), 'payload_custom { "foo" : "bar" }', function(err, response) {
    t.plan(5);
    t.notOk(err);
    t.ok(response.body);
    t.equals(response.body.cmd, 'payload_custom');
    t.equals(response.body.args.foo, 'bar');
    t.equals(Object.keys(response).length, 1);
  });

});

test('shell-adapter-payload: should err on non-200 status code', function(t) {

  payload(Config(), Req({ statusCode: 404 }), 'ls', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
