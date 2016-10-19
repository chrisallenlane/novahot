// TODO: these tests are incomplete

const Config   = require('./mock/config');
const Req      = require('./mock/request');
const download = require('../app/cmd/shell/adapter-download');
const test     = require('tape');

test('shell-adapter-download: should return an error if arguments are not provided', function(t) {

  download(Config(), Req(), 'download', function(err, response) {
    t.plan(2);
    t.true(err.message.match(/^Specify a file to download./));
    t.notOk(response);
  });

});
