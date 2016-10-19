const fs = require('fs');

module.exports = function(options, config) {

  // create a list of available trojans
  var trojans = [];

  // iterate over each trojan directory
  config.global.trojanDir.forEach(function(dir) {

    // register every trojan in each dir
    fs.readdirSync(dir).forEach(function(trojan) {
      trojans.push(trojan);
    });

  });

  // return a list of trojan names as a string
  return trojans.sort().join('\n');
};
