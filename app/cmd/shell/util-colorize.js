const chalk = require('chalk');

module.exports = function(config) {

  const colorize = {
    error  : chalk[config.global.color.error],
    info   : chalk[config.global.color.info],
    notice : chalk[config.global.color.notice],
  };

  return colorize;
};
