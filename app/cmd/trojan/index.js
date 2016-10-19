const list = require('./list');
const view = require('./view');

// invoke the appropriate function based off of options
module.exports = function(options, config) {
  
  // execute the appropriate function
  try {
    const fn = (options.list) ? list : view ;
    console.log(fn(options, config));
  }
  
  // notify on error
  catch (e) {
    console.warn(e.message);
    process.exit(1);
  }

};
