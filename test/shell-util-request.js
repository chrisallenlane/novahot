const Config      = require('./mock/config');
const Mockrequest = require('./mock/request');
const Req         = require('../app/cmd/shell/util-request');
const test        = require('tape');

test('shell-util-request: should correctly initialize', function(t) {

  const state = { cwd: '/tmp' };
  const req   = Req(Config(), Mockrequest(), state);

  t.plan(5);
  t.equals(req.url         , 'https://example.com');
  t.equals(req.json        , true);
  t.deepEquals(req.headers , {});
  t.equals(req.body.auth   , 'sexsecretlovegod');
  t.equals(req.body.cwd    , '/tmp');
});

test('shell-util-request: should mix-in target headers', function(t) {

  const state  = { cwd: '/tmp' };
  const config = Config();

  config.target.headers = {
    foo: 'bar',
    baz: 'bat',
  };

  const req = Req(config, Mockrequest(), state);

  t.plan(6);
  t.equals(req.url         , 'https://example.com');
  t.equals(req.json        , true);
  t.equals(req.headers.foo , 'bar');
  t.equals(req.headers.baz , 'bat');
  t.equals(req.body.auth   , 'sexsecretlovegod');
  t.equals(req.body.cwd    , '/tmp');
});
