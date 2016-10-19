const Config     = require('./mock/config');
const ReplServer = require('./mock/repl-server');
const mode       = require('../app/cmd/shell/mode-payload');
const test       = require('tape');


test('shell-mode-payload: should register the "payload" keyword', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('payload', mode(Config()));

  t.plan(1);
  t.equals(replServer._keyword, 'payload');
});

test('shell-mode-payload: should register the appropriate "help" message', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('payload', mode(Config()));

  t.plan(1);
  t.equals(replServer._definition.help, 'Enter payload mode.');
});

test('shell-mode-payload: should register an action', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('payload', mode(Config()));

  t.plan(1);
  t.equals(typeof replServer._definition.action, 'function');
});

test('shell-mode-payload: should change the prompt', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('payload', mode(Config()));
  replServer._definition.action();

  t.plan(2);
  t.equals(replServer._prompt, 'payload> ');
  t.equals(replServer._initialPrompt, 'payload> ');
});

test('shell-mode-payload: should emit "modechange" when action is invoked', function(t) {

  const replServer = new ReplServer();
  replServer.defineCommand('payload', mode(Config()));

  replServer.on('modechange', function(message, mode) {

    const notice = [
      'Entering payload mode. ',
      '(Ex: payload_name { "foo" : "bar" , "baz" : "bat" })',
    ].join('\n');

    t.equals(message, notice);
    t.equals(mode, 'payload');
  });

  t.plan(2);
  replServer._definition.action();
});
