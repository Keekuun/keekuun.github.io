// exports.done = false;
// var b = require('./b.js');
// console.log('在 a.js 之中，b.done = %j', b.done);
// exports.done = true;
// console.log('a.js 执行完毕');

// const fs = require('fs');
//
// fs.readFile(__filename, data => {
//     // poll（I/O回调） 阶段
//     console.log('readFile')
//
//     Promise.resolve().then(() => {
//         console.error('promise1')
//     })
//     Promise.resolve().then(() => {
//         console.error('promise2')
//     })
// });
//
// setTimeout(() => {
//     // timers 阶段
//     console.log('timeout');
//     Promise.resolve().then(() => {
//         console.error('promise3')
//     })
//     Promise.resolve().then(() => {
//         console.error('promise4')
//     })
// })
//
// // 阻塞一下，保证上面的异步任务准备完毕
// var startTime = new Date().getTime();
// var endTime = startTime;
// while(endTime - startTime < 1000) {
//     endTime = new Date().getTime()
// }

setImmediate(() => {
    console.log('setImmediate')
})

setTimeout(() => {
    console.log('setTimeout');
}, 0)

Promise.resolve().then(() => {
    console.log('promise')
})
process.nextTick(() => {
    console.log('process')
})