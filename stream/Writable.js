const Stream = require('./Stream');
var {
  inherits
} = require('util');

function Writable(options = {}) {
  Stream.call(this,options);
  this._writableState = {
     ended: false,
     writing: false,
     buffer: []
   };
   if (options.write) this._write = options.write;
}
inherits(Writable,Stream)

Writable.prototype.write = function (chunk) {
  this._writableState.buffer.push(chunk)
}

Writable.prototype.end = function (chunk) {
  this._writableState.ended = true;
}