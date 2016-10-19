const lodash = require('lodash');

module.exports = function(config) {

  //replServer.defineCommand('sqlite3', {
  const sqlite3 = {
    help: 'Enter sqlite3 mode.',
    action: function(input) {

      // assert that sqlite3 credentials are being tracked
      if (! config.target.sqlite3) {
        config.target.sqlite3 = {};
      }

      // update sqlite3 connection params if provided
      if (input) {
        try {
          lodash.merge(config.target.sqlite3, JSON.parse(input));
        } catch (e) {
          this.emit(
            'error',
            new Error('Invalid parameters. Parameters must be valid JSON.')
          );
        }
      }

      // assemble the notice (including a reminder regarding "dot commands")
      const notice = [
        'Entering sqlite3 mode. ' + JSON.stringify(config.target.sqlite3),
        '(Notice: omit the leading "." on "dot commands". [Ex: ".tables" => "tables"])',
      ].join('\n');

      // change the prompt
      this._prompt        = 'sqlite> ';
      this._initialPrompt = 'sqlite> ';
      this.emit(
        'modechange',
        notice,
        'sqlite3'
      );
    }
  };

  return sqlite3;
};
