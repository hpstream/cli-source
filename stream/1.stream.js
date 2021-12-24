const { Readable } = require('stream')

const readableIterator = (function (count) {
    return {
        next() {
            count++;
            if (count <= 5) {
                return { done: false, value: count + '' };
            } else {
                return { done: true, value: null }
            }
        }
    }
})(0)

const readableStream = new Readable({
    read() {
        let { done, value } = readableIterator.next();
        if (done) {
            this.push(null);
        } else {
            this.push(value);
        }
    }
});

readableStream.on('data', (data) => {
  console.log(data);
  readableStream.pause();
});