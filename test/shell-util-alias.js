const test  = require('tape');
const alias = require('../app/cmd/shell/util-alias');

const config = {
  global: {
    aliases: {
      'll' : 'ls -al',
    },
  },
};

test('shell-util-alias: should not change commands without an alias', function(t) {

  t.plan(1);
  t.equals(alias(config, 'ls'), 'ls');

});

test('shell-util-alias: should change commands with an alias', function(t) {

  t.plan(1);
  t.equals(alias(config, 'll'), 'ls -al');

});
