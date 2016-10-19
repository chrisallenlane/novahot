module.exports = function(config) {

  // the command definition
  const payload = {
    help: 'Enter payload mode.',
    action: function(input) {
      
      // assemble the notice
      const notice = [
        'Entering payload mode. ',
        '(Ex: payload_name { "foo" : "bar" , "baz" : "bat" })',
      ].join('\n');

      // change the prompt
      this._prompt        = 'payload> ';
      this._initialPrompt = 'payload> ';
      this.emit(
        'modechange',
        notice,
        'payload'
      );
    }
  };

  return payload;
};
