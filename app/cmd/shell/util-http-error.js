const util = require('util');

module.exports = function(config, statusCode) {

  var msg;

  // return a generic error message if the error is not a 404
  if (statusCode !== 404) {

    msg = util.format(
      'Trojan URI (%s) returned HTTP %d.',
      config.target.uri,
      statusCode
    );

    return new Error(msg);
  }

  // return a more specific message on 404
  msg = util.format(
    [
      'Trojan URI (%s) returned HTTP %d.',
      'Assert that <target>.uri is correct in .novahotrc.',
    ].join(' '),
    config.target.uri,
    statusCode
  );

  return new Error(msg);
};
