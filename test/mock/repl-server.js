const EventEmitter = require('events').EventEmitter;
const util         = require('util');

function ReplServer() {

  EventEmitter.call(this);

  this._keyword       = '';
  this._prompt        = '';
  this._initialPrompt = '';

  this.defineCommand = function(keyword, definition) {
    this._keyword    = keyword;
    this._definition = {
      help          : definition.help,
      action        : definition.action.bind(this),
      displayPrompt : function() {},
    };
  };

}

util.inherits(ReplServer, EventEmitter);

module.exports = ReplServer;
