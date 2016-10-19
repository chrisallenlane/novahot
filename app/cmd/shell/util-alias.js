const lodash = require('lodash');

module.exports = function(config, cmd) {

  // if an alias is set, return the aliased command
  if (lodash.get(config, 'global.aliases.' + cmd)) {
    return config.global.aliases[cmd];
  }

  // otherwise, return cmd unaltered
  return cmd;

};
