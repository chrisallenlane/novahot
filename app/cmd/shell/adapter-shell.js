const errors = require('./util-http-error');

module.exports = function(config, req, cmd, callback) {

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
