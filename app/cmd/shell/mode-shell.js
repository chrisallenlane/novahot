module.exports = function(config) {

  // the command definition
  const shell = {
    help: 'Enter shell mode.',
    action: function(input) {

      // change the prompt
      this._prompt        = 'sh> ';
      this._initialPrompt = 'sh> ';
      this.emit(
        'modechange',
        'Entering shell mode.',
        'shell'
      );
    }
  };

  return shell;
};
