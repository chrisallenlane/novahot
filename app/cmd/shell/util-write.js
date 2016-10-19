// function that performs writing
module.exports = function(config, response) {
  
  // colorization helpers
  const colorize = require('./util-colorize')(config);

  if (response.stderr.length > 0) {
    return colorize.error(response.stderr.join('\n'));
  }

  return colorize.info(response.stdout.join('\n'));

};
