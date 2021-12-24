const EventEmitter = require('events');
var {
  inherits
} = require('util');

function Stream(options) {
  this.options = options;
  EventEmitter.call(this);
}
inherits(Stream, EventEmitter);
module.exports = Stream;