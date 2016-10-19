const Config   = require('./mock/config');
const chalk    = require('chalk');
const colorize = require('../app/cmd/shell/util-colorize')(Config());
const test     = require('tape');

test('shell-util-colorize: error should output in the appropriate color', function(t) {
  t.plan(1);
  t.equals(
    colorize.error('foo bar baz'),
    chalk.red('foo bar baz')
  );
});

test('shell-util-colorize: info should output in the appropriate color', function(t) {
  t.plan(1);
  t.equals(
    colorize.info('foo bar baz'),
    chalk.gray('foo bar baz')
  );
});

test('shell-util-colorize: notice should output in the appropriate color', function(t) {
  t.plan(1);
  t.equals(
    colorize.notice('foo bar baz'),
    chalk.yellow('foo bar baz')
  );
});
