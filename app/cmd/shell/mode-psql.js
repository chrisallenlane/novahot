const lodash = require('lodash');

module.exports = function(config) {

  // the command definition
  const psql = {
    help: 'Enter psql mode.',
    action: function(input) {

      // assert that psql credentials are being tracked
      if (! config.target.psql) {
        config.target.psql = {};
      }

      // update psql connection params if provided
      if (input) {
        try {
          lodash.merge(config.target.psql, JSON.parse(input));
        } catch (e) {
          this.emit(
            'error',
            new Error('Invalid parameters. Parameters must be valid JSON.')
          );
        }
      }

      // change the prompt
      this._prompt        = 'postgres=> ';
      this._initialPrompt = 'postgres=> ';
      this.emit(
        'modechange',
        'Entering psql mode. ' + JSON.stringify(config.target.psql),
        'psql'
      );
    }
  };

  return psql;
};
