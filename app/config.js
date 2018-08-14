const path = require('path');
const pkg  = require('../package.json');
const rc   = require('rc');

module.exports = function(options, params) {

  // specify default configs
  var config = rc(pkg.name, {

    // version
    version : params.version,

    // global configs
    global: {
      
      // download dir
      downloadDir : process.cwd(),

      // editors by mime-type
      editors: {
        default: process.env.EDITOR,
      },
      
      // viewers by mime-type
      viewers: {
        default: 'xdg-open',
      },

      // terminal colors
      color: {
        error  : 'red',
        info   : 'gray',
        notice : 'yellow',
      },
    },

    targets : {},

  });

  // append target configs to main configs
  config.target = config.targets[options['<target>']];

  // allow the trojanDir to be appended to
  var trojandir = [ path.join(__dirname, '..', 'trojans') ];

  if (options['--trojan-dir']) {
    trojanDir.push(options['--trojan-dir']);
  } else if (config.global.trojanDir) {
    trojanDir.push(config.global.trojanDir);
  }

  config.global.trojanDir = trojandir;

  // allow the downloadDir to be overriden
  if (options['--download-dir']) {
    config.global.downloadDir = options['--download-dir'];
  }

  // return the configs
  return config;
};
