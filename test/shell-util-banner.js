const test   = require('tape');
const banner = require('../app/cmd/shell/util-banner');

const config = {
  version: '1.2.3',
  target: {
    uri: 'https://example.com'
  },
};

test('shell-util-banner: should return banner', function(t) {

  t.plan(1);
  t.equals(banner(config),  '-=| Jacking in to example.com |=- (novahot@v1.2.3)');

});
