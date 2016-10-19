const lodash  = require('lodash');
const repl    = require('repl');
const request = require('request');
const valid   = require('./util-validate-response');

module.exports = function(options, config) {
  
  // assert that the configs are valid
  if (! config.target) {
    console.warn('<target> is invalid.');
    process.exit(1);
  }
  
  // track application state
  const state    = { cwd: '' , mode: 'shell' };

  // partial-ize functions to bind configs
  const alias    = lodash.partial(require('./util-alias')   , config);
  const banner   = lodash.partial(require('./util-banner')  , config);
  const Req      = lodash.partial(require('./util-request') , config);
  const write    = lodash.partial(require('./util-write')   , config);

  // bind more configs
  const adapters = require('./adapters')(config);
  const colorize = require('./util-colorize')(config);
  const modes    = require('./modes')(config);

  // display the banner
  console.log(colorize.notice(banner()));

  // Define our REPL eval function
  const loop = function (cmd, context, filename, callback) {
    
    // initialize a decorated request object
    const req = Req(request, state);

    // trim the command and process aliases
    cmd = alias(cmd.trim());

    // determine the appropriate adapter
    const adapter = 
      (state.mode === 'mysql')    ? adapters.mysql        :
      (state.mode === 'payload')  ? adapters.payload      :
      (state.mode === 'psql')     ? adapters.psql         :
      (state.mode === 'sqlite3')  ? adapters.sqlite3      :
      (/^autodestruct/.test(cmd)) ? adapters.autodestruct :
      (/^download/.test(cmd))     ? adapters.download     :
      (/^edit/    .test(cmd))     ? adapters.edit         :
      (/^top/     .test(cmd))     ? adapters.top          :
      (/^upload/  .test(cmd))     ? adapters.upload       :
      (/^view/    .test(cmd))     ? adapters.view         :
      adapters.shell
    ;

    // execute the adapter
    adapter(req, cmd, function(err, response) {

      // handle errors
      if (err) {
        return callback(colorize.error(err));
      }

      // handle malformed responses
      if (!valid(response)) {

        // assemble the error message
        var error = 'Received malformed response:\n';

        if (typeof response === 'object') {
          error += JSON.stringify(response, null, ' '); 
        } else {
          error += response;
        }

        // display a colorized error
        return callback(colorize.error(new Error(error)));
      }

      // update the cwd state
      state.cwd = response.cwd;

      // write the output
      callback(null, response);
    });
  };

  // declare REPL params
  const params = {
    prompt : 'sh> ',
    eval   : loop,
    writer : write,
  };

  // start the REPL, and define commands
  const replServer = repl.start(params);
  replServer.defineCommand('mysql'   , modes.mysql());
  replServer.defineCommand('payload' , modes.payload());
  replServer.defineCommand('psql'    , modes.psql());
  replServer.defineCommand('sh'      , modes.shell());
  replServer.defineCommand('shell'   , modes.shell());
  replServer.defineCommand('sqlite3' , modes.sqlite3());

  replServer.on('error', function(err) {
    console.log(colorize.error(err));
  });

  replServer.on('modechange', function(err, mode) {
    state.mode = mode;
    console.log(colorize.notice(err));
    replServer.displayPrompt();
  });

};
