// TODO: these tests are incomplete

const Config = require('./mock/config');
const Req    = require('./mock/request');
const view   = require('../app/cmd/shell/adapter-view');
const test   = require('tape');

test('shell-adapter-view: should return an error if arguments are not provided', function(t) {

  view(Config(), Req(), 'view', function(err, response) {
    t.plan(2);
    t.true(err.message.match(/^Specify a file to view./));
    t.notOk(response);
  });

});
