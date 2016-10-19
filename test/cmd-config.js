const fs   = require('fs');
const path = require('path');
const test = require('tape');

// NB: we're not actually testing the output of the config command here, but
// rather the contents of the file that the former should return.
test('cmd-config: should return valid sample config', function(t) {
  t.plan(15);

  const file     = path.join(__dirname, '../app/cmd/config/sample-config.json');
  const contents = fs.readFileSync(file);

  // assert that the sample file contains valid JSON
  t.doesNotThrow(
    (function() { JSON.parse(contents); })
  );

  // parse the object for further testing
  const obj = JSON.parse(contents);

  // assert that the expected properties are present
  t.ok(obj.global);
  t.ok(obj.global.aliases);
  t.ok(obj.global.colors);
  t.ok(obj.global.headers);
  t.ok(obj.global.downloadDir);
  t.ok(obj.global.editors);
  t.ok(obj.global.viewers);
  t.ok(obj.targets);
  t.ok(obj.targets['example.com']);
  t.ok(obj.targets['example.com'].uri);
  t.ok(obj.targets['example.com'].password);
  t.ok(obj.targets['example.com'].mysql);
  t.ok(obj.targets['example.com'].psql);
  t.ok(obj.targets['example.com'].sqlite3);

});
