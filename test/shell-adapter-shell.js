const Config = require('./mock/config');
const Req    = require('./mock/request');
const sh     = require('../app/cmd/shell/adapter-shell');
const test   = require('tape');

test('shell-adapter-shell: should send shell commands', function(t) {

  sh(Config(), Req(), 'ls', function(err, response) {
    t.plan(4);
    t.notOk(err);
    t.ok(response.body);
    t.equals(response.body.cmd, 'ls');
    t.equals(Object.keys(response).length, 1);
  });

});

test('shell-adapter-shell: should err on non-200 status code', function(t) {

  sh(Config(), Req({ statusCode: 404 }), 'ls', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
