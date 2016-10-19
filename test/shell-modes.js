const Config = require('./mock/config');
const modes  = require('../app/cmd/shell/modes')(Config());
const test   = require('tape');

test('shell-modes: should have the correct methods', function(t) {

  t.plan(6);
  t.equals(Object.keys(modes).length , 5);
  t.equals(typeof modes.payload      , 'function');
  t.equals(typeof modes.mysql        , 'function');
  t.equals(typeof modes.psql         , 'function');
  t.equals(typeof modes.shell        , 'function');
  t.equals(typeof modes.sqlite3      , 'function');

});
