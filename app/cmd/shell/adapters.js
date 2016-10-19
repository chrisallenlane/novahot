const lodash = require('lodash');

module.exports = function(config) {

  const adapters = {
    autodestruct : lodash.partial(require('./adapter-autodestruct') , config) ,
    download     : lodash.partial(require('./adapter-download')     , config) ,
    edit         : lodash.partial(require('./adapter-edit')         , config) ,
    mysql        : lodash.partial(require('./adapter-mysql')        , config) ,
    payload      : lodash.partial(require('./adapter-payload')      , config) ,
    psql         : lodash.partial(require('./adapter-psql')         , config) ,
    shell        : lodash.partial(require('./adapter-shell')        , config) ,
    sqlite3      : lodash.partial(require('./adapter-sqlite3')      , config) ,
    top          : lodash.partial(require('./adapter-top')          , config) ,
    upload       : lodash.partial(require('./adapter-upload')       , config) ,
    view         : lodash.partial(require('./adapter-view')         , config) ,
  };

  return adapters;
};
