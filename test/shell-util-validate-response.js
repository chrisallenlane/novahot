const test  = require('tape');
const valid = require('../app/cmd/shell/util-validate-response');


test('shell-util-validate-response: should pass properly formed responses', function(t) {

  const response = {
    cwd    : '/tmp',
    stderr : [],
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), true);
});

test('shell-util-validate-response: should fail non-objects', function(t) {

  const response = 'foo bar baz';

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with missing properties', function(t) {

  const response = {
    stderr : [],
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with extra properties', function(t) {

  const response = {
    cwd    : '/tmp',
    stderr : [],
    stdout : [ 'index.html' ],
    foo    : 'bar',
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a missing cwd', function(t) {

  const response = {
    stderr : [],
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a missing stdout', function(t) {

  const response = {
    cwd    : '/tmp',
    stderr : [],
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a missing stderr', function(t) {

  const response = {
    cwd    : '/tmp',
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a malformed cwd', function(t) {

  const response = {
    cwd    : [],
    stderr : [],
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a malformed stdout', function(t) {

  const response = {
    cwd    : '/tmp',
    stderr : [],
    stdout : 'index.html',
  };

  t.plan(1);
  t.equals(valid(response), false);
});

test('shell-util-validate-response: should fail objects with a malformed stderr', function(t) {

  const response = {
    cwd    : '/tmp',
    stderr : '',
    stdout : [ 'index.html' ],
  };

  t.plan(1);
  t.equals(valid(response), false);
});
