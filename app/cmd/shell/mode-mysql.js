const lodash = require('lodash');

module.exports = function(config) {

  // the command definition
  const mysql = {
    help: 'Enter mysql mode.',
    action: function(input) {

      // assert that mysql credentials are being tracked
      if (! config.target.mysql) {
        config.target.mysql = {};
      }

      // update mysql connection params if provided
      if (input) {
        try {
          lodash.merge(config.target.mysql, JSON.parse(input));
        } catch (e) {
          this.emit(
            'error',
            new Error('Invalid parameters. Parameters must be valid JSON.')
          );
        }
      }

      // change the prompt
      this._prompt        = 'mysql> ';
      this._initialPrompt = 'mysql> ';
      this.emit(
        'modechange',
        'Entering mysql mode. ' + JSON.stringify(config.target.mysql),
        'mysql'
      );
    }
  };

  return mysql;
};
