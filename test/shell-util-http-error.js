const Config = require('./mock/config');
const error  = require('../app/cmd/shell/util-http-error');
const test   = require('tape');

test('shell-util-http-error: should respond appropriately to 404', function(t) {
  t.plan(1);

  const err      = error(Config(), 404);
  const expected = [
    'Trojan URI (https://example.com) returned HTTP 404.',
    'Assert that <target>.uri is correct in .novahotrc.',
  ].join(' ');

  t.equals(err.message, expected);
});

test('shell-util-http-error: should respond appropriately to other status codes', function(t) {
  t.plan(1);

  const err      = error(Config(), 500);
  const expected = 'Trojan URI (https://example.com) returned HTTP 500.';

  t.equals(err.message, expected);
});
