// TODO: these tests are incomplete

const Config = require('./mock/config');
const Req    = require('./mock/request');
const edit   = require('../app/cmd/shell/adapter-edit');
const test   = require('tape');

test('shell-adapter-edit: should return an error if arguments are not provided', function(t) {

  edit(Config(), Req(), 'edit', function(err, response) {
    t.plan(2);
    t.true(err.message.match(/^Specify a file to edit./));
    t.notOk(response);
  });

});
