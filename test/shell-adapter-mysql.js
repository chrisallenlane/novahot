const Req    = require('./mock/request');
const mysql  = require('../app/cmd/shell/adapter-mysql');
const test   = require('tape');

test('shell-adapter-mysql: should fail if username is unspecified', function(t) {

  var config = {
    target : {
      mysql : {
        password: 'foo',
      },
    },
  };

  mysql(config, Req(), 'SHOW TABLES', function(err, response) {
    t.plan(2);
    t.equals(err.message, 'config: mysql username unspecified.');
    t.notOk(response);
  });

});

test('shell-adapter-mysql: should fail if password is unspecified', function(t) {

  var config = {
    target : {
      mysql : {
        username: 'foo',
      },
    },
  };

  mysql(config, Req(), 'SHOW TABLES', function(err, response) {
    t.plan(2);
    t.equals(err.message, 'config: mysql password unspecified.');
    t.notOk(response);
  });

});

test('shell-adapter-mysql: USE command should change config', function(t) {

  var config = {
    target : {
      mysql : {
        username: 'foo',
        password: 'bar',
        database: 'baz',
      },
    },
  };

  mysql(config, Req(), 'USE newdatabase', function(err, response) {
    t.plan(2);
    t.notOk(err);
    t.equals(config.target.mysql.database, 'newdatabase');
  });

});

test('shell-adapter-mysql: should send database commands (no database specified)', function(t) {

  var config = {
    target : {
      mysql : {
        username: 'foo',
        password: 'bar',
      },
    },
  };

  mysql(config, Req(), 'SHOW TABLES', function(err, response) {

    t.plan(2);
    t.notOk(err);
    t.equals(
      response.body.cmd,
      'mysql -t -ufoo -pbar  -eSHOW\\ TABLES'
    );
  });

});

test('shell-adapter-mysql: should send database commands (database specified)', function(t) {

  var config = {
    target : {
      mysql : {
        username: 'foo',
        password: 'bar',
        database: 'baz',
      },
    },
  };

  mysql(config, Req(), 'SHOW TABLES', function(err, response) {

    t.plan(2);
    t.notOk(err);
    t.equals(
      response.body.cmd,
      'mysql -t -ufoo -pbar baz -eSHOW\\ TABLES'
    );
  });

});

test('shell-adapter-mysql: should err on non-200 status code', function(t) {

  var config = {
    target : {
      uri   : 'https://example.com',
      mysql : {
        username: 'foo',
        password: 'bar',
        database: 'baz',
      },
    },
  };

  mysql(config, Req({ statusCode: 404 }), 'SHOW TABLES', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
