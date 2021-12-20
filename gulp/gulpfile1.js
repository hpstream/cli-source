/**
  学习目标：
    1. 异步函数的三种形式(回调done,promise,async)
    2. 如何使用并行和串行
 */
const fs = require('fs');
const through = require('through2');
const {
  series,
  parallel
} = require('gulp');

function callbackTask(done) {
  setTimeout(() => {
    console.log('callbackTask');
    done();
  }, 1000);
}

function promiseTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('promiseTask');
      resolve();
    }, 1000);
  });
}
async function asyncTask() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  console.log('asyncTask');
}

function streamTask() {
  return fs.createReadStream('input.txt')
    .pipe(through((chunk, encoding, next) => {
      setTimeout(() => {
        // console.log(chunk.toString())
        next(null, chunk);
      }, 1000);
    }))
    .pipe(fs.createWriteStream('output.txt'))
}
exports.default = callbackTask
exports.promise = promiseTask
exports.async = asyncTask
exports.stream = streamTask
const parallelTask = parallel(callbackTask, promiseTask, asyncTask, streamTask);
const seriesTask = series(callbackTask, promiseTask, asyncTask, streamTask);
exports.parallel = parallelTask
exports.series = seriesTask