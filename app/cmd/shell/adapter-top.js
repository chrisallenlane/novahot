const errors     = require('./util-http-error');
const shellwords = require('shellwords');

module.exports = function(config, req, cmd, callback) {

  // force "batch mode" to prevent the process from hanging
  const parts = shellwords.split(cmd);
  parts.shift();
  cmd = 'top -n1 -b ' + parts.join(' ');
  
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
