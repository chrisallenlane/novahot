const Config     = require('./mock/config');
const ReplServer = require('./mock/repl-server');
const mode       = require('../app/cmd/shell/mode-shell');
const test       = require('tape');


test('shell-mode-shell: should register the "shell" keyword', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('shell', mode(Config()));

  t.plan(1);
  t.equals(replServer._keyword, 'shell');
});

test('shell-mode-shell: should register the appropriate "help" message', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('shell', mode(Config()));

  t.plan(1);
  t.equals(replServer._definition.help, 'Enter shell mode.');
});

test('shell-mode-shell: should register an action', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('shell', mode(Config()));

  t.plan(1);
  t.equals(typeof replServer._definition.action, 'function');
});

test('shell-mode-shell: should change the prompt', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('shell', mode(Config()));
  replServer._definition.action();

  t.plan(2);
  t.equals(replServer._prompt, 'sh> ');
  t.equals(replServer._initialPrompt, 'sh> ');
});

test('shell-mode-shell: should emit "modechange" when action is invoked', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('shell', mode(Config()));

  replServer.on('modechange', function(message, mode) {
    t.equals(message, 'Entering shell mode.');
    t.equals(mode, 'shell');
  });

  t.plan(2);
  replServer._definition.action();
});
