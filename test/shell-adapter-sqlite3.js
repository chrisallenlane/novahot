const Req     = require('./mock/request');
const sqlite3 = require('../app/cmd/shell/adapter-sqlite3');
const test    = require('tape');

test('shell-adapter-sqlite3: should fail if database is unspecified', function(t) {

  var config = {
    target : {
      sqlite3 : { },
    },
  };

  sqlite3(config, Req(), 'tables', function(err, response) {
    t.plan(2);
    t.equals(err.message, 'config: sqlite3 database file unspecified.');
    t.notOk(response);
  });

});

test('shell-adapter-sqlite3: should send database commands', function(t) {

  var config = {
    target : {
      sqlite3 : { 
        file: 'foo',
      },
    },
  };

  sqlite3(config, Req(), 'SELECT * FROM bar', function(err, response) {
    t.plan(2);
    t.equals(
      response.body.cmd,
      'sqlite3 -header -column -batch foo SELECT\\ \\*\\ FROM\\ bar'
    );
    t.notOk(err);
  });

});

test('shell-adapter-sqlite3: dotcommands should be recognized', function(t) {

  var config = {
    target : {
      sqlite3 : { 
        file: 'foo',
      },
    },
  };

  // enumerate the dotcommands
  const dotcommands = [
    'backup'  , 'bail'    , 'databases' , 'dump'      , 'echo'    , 'exit'  ,
    'explain' , 'header'  , 'help'      , 'import'    , 'indices' , 'load'  ,
    'log'     , 'mode'    , 'nullvalue' , 'output'    , 'prompt'  , 'quit'  ,
    'read'    , 'restore' , 'schema'    , 'separator' , 'show'    , 'stats' ,
    'tables'  , 'timeout' , 'timer'     , 'trace'     , 'vfsname' , 'width' ,
  ];
  
  // run two tests per command
  t.plan(dotcommands.length * 2);

  // iterate over each dotcommand, asserting that it is recognized
  dotcommands.forEach(function(command) {

    sqlite3(config, Req(), command, function(err, response) {
      t.equals(
        response.body.cmd,
        'sqlite3 -header -column -batch foo .' + command,
        command
      );
      t.notOk(err);
    });
  });

});

test('shell-adapter-sqlite3: should err on non-200 status code', function(t) {

  var config = {
    target : {
      uri     : 'https://example.com',
      sqlite3 : { 
        file: 'foo',
      },
    },
  };

  sqlite3(config, Req({ statusCode: 404 }), 'SELECT * FROM bar', function(err, response) {
    t.plan(2);
    t.ok(err);
    t.notOk(response);
  });

});
