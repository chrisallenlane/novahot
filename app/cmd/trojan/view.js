const fs   = require('fs');
const path = require('path');

module.exports = function(options, config) {

  // create a map of trojan names to file paths
  var trojans = {};
  config.global.trojanDir.forEach(function(dir) {
    fs.readdirSync(dir).forEach(function(name) {
      trojans[name] = path.join(dir, name);
    });
  });

  // assert that the trojan exists
  if (!trojans[options['<filename>']]) {
    throw new Error('The specified <filename> does not exist.');
  }

  // return the trojan source
  return fs.readFileSync(
    trojans[options['<filename>']],
    { encoding: 'utf8' }
  );
};
