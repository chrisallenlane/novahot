const Config = require('./mock/config');
const view   = require('../app/cmd/trojan/view');
const path   = require('path');
const test   = require('tape');

test('trojan-view: should return the appropriate source (default trojans)', function(t) {
  
  // fetch the source code and split it into lines
  const options = { '<filename>': 'reference-ruby1.9.3.rb.cgi' };
  const source  = view(options, Config()).split('\n');

  // assert that the top line equals the appropriate shebang
  t.plan(1);
  t.equals(source[0], '#!/usr/bin/env ruby');

});

test('trojan-view: should return the appropriate source (--trojan-dir trojans)', function(t) {
  
  // manually modify configs for testing purposes
  var config = Config();
  config.global.trojanDir.push(path.join(__dirname, './mock/trojans'));
  
  // fetch the source code
  const options = { '<filename>': 'a.cgi' };
  const source  = view(options, config);

  // assert that the top line equals the appropriate shebang
  t.plan(1);
  t.equals(source, '<?= "im in ur base" ?>\n');

});

test('trojan-view: should throw if --trojan-dir is invalid', function(t) {

  // manually modify configs for testing purposes
  var config = Config();
  config.global.trojanDir.push(path.join(__dirname, './does/not/exist'));

  const options = { '<filename>' : 'a.cgi' };

  // test
  t.plan(1);
  t.throws(
    function() { view(options, config); },
    /^Error: ENOENT/
  );

});

test('trojan-view: should throw if <filename> is invalid', function(t) {

  t.plan(1);
  t.throws(
    function() { view({ '<filename>' : 'd.cgi' }, Config()); },
    /^Error: The specified <filename>/
  );

});
