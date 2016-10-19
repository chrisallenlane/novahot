const url = require('url');

module.exports = function(config) {
  const target = url.parse(config.target.uri).hostname;
  return '-=| Jacking in to ' + target + ' |=- (novahot@v' + config.version + ')';
};
