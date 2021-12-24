const Stream = require('./Stream');
const {inherits} = require('util');

function Readable(options={}) {
   Stream.call(this, options);
    this._readableState = {
      ended: false, //水井是否抽取结束,水井是否已经干涸
      buffer: [], //水箱 水泵把水从井时抽出来放到水箱里
      flowing: false //开关是否打开，如果打开会持续抽水，并且发送给用户
    };
    //把传递过来的read方法存放到_read上，用来向数据源读取数据
    if (options.read) this._read = options.read;
}
inherits(Readable,Stream)

Readable.prototype.on = function (eventName,fn) {
   Stream.prototype.on.call(this, eventName, fn)
   if(eventName==='data'){
     this.resume();
   }
}

Readable.prototype.resume = function (eventName, fn) {
  this._readableState.flowing = true;
  while (this.read());
}
Readable.prototype.read = function () {
  if(this._readableState.flowing && !this._readableState.ended){
    this._read();
  }
  let data = this._readableState.buffer.shift();
  // console.log(data)
   if (data) {
     this.emit('data', data);
   }
  return data;

}

Readable.prototype.push = function (chunk) {
 if (chunk === null) {
   this._readableState.ended = true; //结束
 } else {
   this._readableState.buffer.push(chunk);
 }
}
module.exports = Readable;