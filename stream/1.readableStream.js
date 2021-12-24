// const readableStream = require('./readableStream');
//继承自EventEmitter
const Readable = require('./Readable');
//水井
let cell = ['1', '2', '3', '4', '5'];
let idx = 0;
const readableStream = new Readable({
  read() {
    if (idx >= cell.length) {
      this.push(null);
    } else {
      this.push(cell[idx]);
    }
    idx++;
  }
});

readableStream.on('data',(chunk)=>{
  console.log('1');
})


// module.exports = readableStream;