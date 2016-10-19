const Config = require('./mock/config');
const list   = require('../app/cmd/trojan/list');
const path   = require('path');
const test   = require('tape');

const defaults = [
  'reference-php5.php',
  'reference-python2.7.3.py.cgi',
  'reference-ruby1.9.3.rb.cgi',
];

const additional = [
  'a.cgi',
  'b.cgi',
  'c.cgi',
];

test('trojan-list: should locate the default trojans', function(t) {
  t.plan(1);
  t.equals(list({}, Config()), defaults.join('\n'));
});

test('trojan-list: should respect --trojan-dir', function(t) {

  // manually modify configs for testing purposes
  var config = Config();
  config.global.trojanDir.push(path.join(__dirname, './mock/trojans'));

  // assemble all trojans
  const all = additional.concat(defaults);

  // test
  t.plan(1);
  t.equals(list({}, config), all.join('\n'));
});

test('trojan-list: should throw if --trojan-dir is invalid', function(t) {

  // manually modify configs for testing purposes
  var config = Config();
  config.global.trojanDir.push(path.join(__dirname, './does/not/exist'));

  // test
  t.plan(1);
  t.throws(
    function() { list({}, config); },
    /^Error: ENOENT/
  );

});
