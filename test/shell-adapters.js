const Config   = require('./mock/config');
const adapters = require('../app/cmd/shell/adapters')(Config());
const test     = require('tape');

test('shell-adapters: should have the correct methods', function(t) {

  t.plan(12);
  t.equals(Object.keys(adapters).length , 11);
  t.equals(typeof adapters.autodestruct , 'function');
  t.equals(typeof adapters.download     , 'function');
  t.equals(typeof adapters.edit         , 'function');
  t.equals(typeof adapters.mysql        , 'function');
  t.equals(typeof adapters.payload      , 'function');
  t.equals(typeof adapters.psql         , 'function');
  t.equals(typeof adapters.shell        , 'function');
  t.equals(typeof adapters.sqlite3      , 'function');
  t.equals(typeof adapters.top          , 'function');
  t.equals(typeof adapters.upload       , 'function');
  t.equals(typeof adapters.view         , 'function');

});
