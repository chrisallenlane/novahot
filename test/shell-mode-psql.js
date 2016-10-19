const Config     = require('./mock/config');
const ReplServer = require('./mock/repl-server');
const mode       = require('../app/cmd/shell/mode-psql');
const test       = require('tape');


test('shell-mode-psql: should register the "psql" keyword', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));

  t.plan(1);
  t.equals(replServer._keyword, 'psql');
});

test('shell-mode-psql: should register the appropriate "help" message', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));

  t.plan(1);
  t.equals(replServer._definition.help, 'Enter psql mode.');
});

test('shell-mode-psql: should register an action', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));

  t.plan(1);
  t.equals(typeof replServer._definition.action, 'function');
});

test('shell-mode-psql: should change the prompt', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));
  replServer._definition.action();

  t.plan(2);
  t.equals(replServer._prompt, 'postgres=> ');
  t.equals(replServer._initialPrompt, 'postgres=> ');
});

test('shell-mode-psql: should emit "modechange" when action is invoked', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));

  replServer.on('modechange', function(message, mode) {
    t.equals(message, 'Entering psql mode. {}');
    t.equals(mode, 'psql');
  });

  t.plan(2);
  replServer._definition.action();
});

test('shell-mode-psql (action): should error with invalid input', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('psql', mode(Config()));

  replServer.on('error', function(err) {
    t.equals(err.message, 'Invalid parameters. Parameters must be valid JSON.');
  });

  t.plan(1);
  replServer._definition.action('foo');
});

test('shell-mode-psql (action): should merge params with valid input', function(t) {

  const replServer = new ReplServer();
  const config     = Config();
  replServer.defineCommand('psql', mode(config));

  replServer.on('modechange', function(message, mode) {
    t.equals(config.target.psql.username, 'foo');
  });

  t.plan(1);
  replServer._definition.action('{ "username" : "foo" }');
});
