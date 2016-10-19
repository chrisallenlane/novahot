const Config     = require('./mock/config');
const ReplServer = require('./mock/repl-server');
const mode       = require('../app/cmd/shell/mode-mysql');
const test       = require('tape');


test('shell-mode-mysql: should register the "mysql" keyword', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));

  t.plan(1);
  t.equals(replServer._keyword, 'mysql');
});

test('shell-mode-mysql: should register the appropriate "help" message', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));

  t.plan(1);
  t.equals(replServer._definition.help, 'Enter mysql mode.');
});

test('shell-mode-mysql: should register an action', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));

  t.plan(1);
  t.equals(typeof replServer._definition.action, 'function');
});

test('shell-mode-mysql: should change the prompt', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));
  replServer._definition.action();

  t.plan(2);
  t.equals(replServer._prompt, 'mysql> ');
  t.equals(replServer._initialPrompt, 'mysql> ');
});

test('shell-mode-mysql: should emit "modechange" when action is invoked', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));

  replServer.on('modechange', function(message, mode) {
    t.equals(message, 'Entering mysql mode. {}');
    t.equals(mode, 'mysql');
  });

  t.plan(2);
  replServer._definition.action();
});

test('shell-mode-mysql (action): should error with invalid input', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('mysql', mode(Config()));

  replServer.on('error', function(err) {
    t.equals(err.message, 'Invalid parameters. Parameters must be valid JSON.');
  });

  t.plan(1);
  replServer._definition.action('foo');
});

test('shell-mode-mysql (action): should merge params with valid input', function(t) {

  const replServer = new ReplServer();
  const config     = Config();
  replServer.defineCommand('mysql', mode(config));

  replServer.on('modechange', function(message, mode) {
    t.equals(config.target.mysql.username, 'foo');
  });

  t.plan(1);
  replServer._definition.action('{ "username" : "foo" }');
});
