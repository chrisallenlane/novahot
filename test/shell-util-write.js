const Config = require('./mock/config');
const chalk  = require('chalk');
const test   = require('tape');
const write  = require('../app/cmd/shell/util-write');

test('shell-util-write: write should properly colorize stderr', function(t) {
  t.plan(1);
  t.equals(
    write(Config(), { stderr : [ 'foo bar baz' ], stdout: [] }),
    chalk.red('foo bar baz')
  );
});

test('shell-util-write: write should properly colorize stdout', function(t) {
  t.plan(1);
  t.equals(
    write(Config(), { stderr: [], stdout : [ 'foo bar baz' ]}),
    chalk.gray('foo bar baz')
  );
});
