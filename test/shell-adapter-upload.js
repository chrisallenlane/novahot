// TODO: these tests are incomplete

const Config = require('./mock/config');
const Req    = require('./mock/request');
const upload = require('../app/cmd/shell/adapter-upload');
const test   = require('tape');

test('shell-adapter-upload: should return an error if arguments are not provided', function(t) {

  upload(Config(), Req(), 'upload', function(err, response) {
    t.plan(2);
    t.true(err.message.match(/^Specify a file to upload./));
    t.notOk(response);
  });

});
