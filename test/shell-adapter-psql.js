const Req  = require('./mock/request');
const psql = require('../app/cmd/shell/adapter-psql');
const test = require('tape');

test('shell-adapter-psql: should fail if username is unspecified', function(t) {

  var config = {
    target : {
      psql : { },
    },
  };

  psql(config, Req(), '\\l', function(err, response) {
    t.plan(2);
    t.equals(err.message, 'config: psql username unspecified.');
    t.notOk(response);
  });

});

test('shell-adapter-psql: \\connect command should change config', function(t) {

  var config = {
    target : {
      psql : {
        username: 'foo',
        database: 'baz',
      },
    },
  };

  psql(config, Req(), '\\connect newdatabase', function(err, response) {
    t.plan(2);
    t.notOk(err);
    t.equals(config.target.psql.database, 'newdatabase');
  });

});

test('shell-adapter-psql: should send database commands (no database specified)', function(t) {

  var config = {
    target : {
      psql : {
        username: 'foo',
      },
    },
  };

  psql(config, Req(), 'SELECT * FROM bar;', function(err, response) {

    t.plan(2);
    t.notOk(err);
    t.equals(
      response.body.cmd,
      'psql -U foo  -c SELECT\\ \\*\\ FROM\\ bar\\;'
    );
  });

});

test('shell-adapter-psql: should send database commands (database specified)', function(t) {

  var config = {
    target : {
      psql : {
        username: 'foo',
        database: 'baz',
      },
    },
  };

  psql(config, Req(), 'SELECT * FROM bar;', function(err, response) {

    t.plan(2);
    t.notOk(err);
    t.equals(
      response.body.cmd,
      'psql -U foo baz -c SELECT\\ \\*\\ FROM\\ bar\\;'
    );
  });

});

test('shell-adapter-psql: should err on non-200 status code', function(t) {

  var config = {
    target : {
      uri  : 'https://example.com',
      psql : {
        username: 'foo',
        database: 'baz',
      },
    },
  };

  psql(config, Req({ statusCode: 404 }), 'SELECT * FROM bar;', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
