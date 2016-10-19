const Config       = require('./mock/config');
const Req          = require('./mock/request');
const autodestruct = require('../app/cmd/shell/adapter-autodestruct');
const test         = require('tape');

test('shell-adapter-autodestruct: should properly structure command', function(t) {

  autodestruct(Config(), Req(), 'autodestruct', function(err, response) {
    t.plan(3);
    t.notOk(err);
    t.equals(response.body.cmd, 'payload_autodestruct');
    t.equals(Object.keys(response.body.args).length, 0);
  });

});

test('shell-adapter-autodestruct: should err on non-200 status code', function(t) {

  autodestruct(Config(), Req({ statusCode: 404 }), 'autodestruct', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
