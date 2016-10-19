const Config     = require('./mock/config');
const ReplServer = require('./mock/repl-server');
const mode       = require('../app/cmd/shell/mode-sqlite3');
const test       = require('tape');


test('shell-mode-sqlite3: should register the "sqlite3" keyword', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));

  t.plan(1);
  t.equals(replServer._keyword, 'sqlite3');
});

test('shell-mode-sqlite3: should register the appropriate "help" message', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));

  t.plan(1);
  t.equals(replServer._definition.help, 'Enter sqlite3 mode.');
});

test('shell-mode-sqlite3: should register an action', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));

  t.plan(1);
  t.equals(typeof replServer._definition.action, 'function');
});

test('shell-mode-sqlite3: should change the prompt', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));
  replServer._definition.action();

  t.plan(2);
  t.equals(replServer._prompt, 'sqlite> ');
  t.equals(replServer._initialPrompt, 'sqlite> ');
});

test('shell-mode-sqlite3: should emit "modechange" when action is invoked', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));

  // assemble the expected notice
  const notice = [
    'Entering sqlite3 mode. {}',
    '(Notice: omit the leading "." on "dot commands". [Ex: ".tables" => "tables"])',
  ].join('\n');

  replServer.on('modechange', function(message, mode) {
    t.equals(message, notice);
    t.equals(mode, 'sqlite3');
  });

  t.plan(2);
  replServer._definition.action();
});

test('shell-mode-sqlite3 (action): should error with invalid input', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('sqlite3', mode(Config()));

  replServer.on('error', function(err) {
    t.equals(err.message, 'Invalid parameters. Parameters must be valid JSON.');
  });

  t.plan(1);
  replServer._definition.action('foo');
});

test('shell-mode-sqlite3 (action): should merge params with valid input', function(t) {

  const replServer = new ReplServer();
  const config     = Config();
  replServer.defineCommand('sqlite3', mode(config));

  replServer.on('modechange', function(message, mode) {
    t.equals(config.target.sqlite3.file, 'foo');
  });

  t.plan(1);
  replServer._definition.action('{ "file" : "foo" }');
});
