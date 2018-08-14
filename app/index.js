#!/usr/bin/env node

// dependencies
const cmd     = require('./cmd');
const docopt  = require('docopt').docopt;
const fs      = require('fs');
const mkdirp  = require('mkdirp');
const path    = require('path');
const version = require('../package.json').version;

// generate and parse the command-line options
const doc     = fs.readFileSync(path.join(__dirname, 'docopt.txt'), 'utf8');
const options = docopt(doc, { version: version });

// load the configs
var config = require('./config')(options, { version : version });

// assert that the download dir exists
try {
  mkdirp.sync(config.global.downloadDir);
} catch (e) {
  console.warn('Cannot create download dir: ' + config.global.downloadDir);
  console.warn(e.message);
  process.exit(1);
}

// determine the appropriate subcommand
var subcommand = 
  (options.config) ? cmd.config :
  (options.shell)  ? cmd.shell  :
  (options.trojan) ? cmd.trojan :
  ( function() { throw 'Invalid subcommand'; })
;

// execute
subcommand(options, config);
