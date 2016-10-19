const lodash = require('lodash');

module.exports = function(config) {

  const modes = {
    mysql   : lodash.partial(require('./mode-mysql')   , config),
    payload : lodash.partial(require('./mode-payload')   , config),
    psql    : lodash.partial(require('./mode-psql')    , config),
    shell   : lodash.partial(require('./mode-shell')   , config),
    sqlite3 : lodash.partial(require('./mode-sqlite3') , config),
  };

  return modes;
};
