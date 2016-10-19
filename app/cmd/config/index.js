const fs   = require('fs');
const path = require('path');

module.exports = function(options, config) {

  // construct the path to the example config file
  const example = path.join(__dirname, 'sample-config.json');

  // write the example config file to stdout
  fs.createReadStream(example).pipe(process.stdout);
};
