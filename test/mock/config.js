const path = require('path');

function Config () {

  // mock config info
  var config = {
    global: {
      color: {
        error  : 'red',
        info   : 'gray',
        notice : 'yellow',
      },
    },

    target: {
      uri      : 'https://example.com',
      password : 'sexsecretlovegod',
    }
  };

  // trojan dir
  config.global.trojanDir = [ path.join(__dirname, '../..', 'trojans') ];

  return config;
}

module.exports = Config;
