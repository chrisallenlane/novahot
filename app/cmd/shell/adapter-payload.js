const errors = require('./util-http-error');

module.exports = function(config, req, cmd, callback) {
  
  // parse the input
  const split = cmd.indexOf(' ');
  var payload = cmd;
  var argstr  = '';
  var args    = {};

  // parse args if provided
  if (split != -1) {
    payload = cmd.substring(0, split).trim();
    argstr  = cmd.substring(split + 1).trim();

    // attempt to parse the args as JSON
    try {
      args = JSON.parse(argstr);
    } catch (e) {
      return callback(new Error('Invalid parameters. Parameters must be valid JSON.'));
    }
  }

  // initialize the POST body
  const body = {
    cmd  : payload,
    args : args,
  };

  // POST to the trojan
  req.post({ body : body }, function(err, obj, response) {

    if (obj.statusCode !== 200) {
      return callback(errors(config, obj.statusCode));
    }

    callback(err, response);
  });
};
