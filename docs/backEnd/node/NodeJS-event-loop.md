# NodeJS事件循环

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709951e658af197~tplv-t2oaga2asx-watermark.awebp)

## NodeJS中常见的异步形式：
+ 文件I/O：异步加载文件
+ setImmediate(): 与setTimeout(() => {}, 0)类似,在同步任务完成后立马执行。
+ process.nextTick(): 在某些同步任务完成后立马执行
+ server.close、socket.on('close')：关闭回调

```md
setImmediate() 与 setTimeout(() => {}, 0)（传入 0 毫秒的超时）、process.nextTick() 有何不同？

传给 process.nextTick() 的函数会在事件循环的当前迭代中（当前操作结束之后）被执行。 这意味着它会始终在 setTimeout 和 setImmediate 之前执行。

延迟 0 毫秒的 setTimeout() 回调与 setImmediate() 非常相似。 执行顺序取决于各种因素，但是它们都会在事件循环的下一个迭代中运行。
```

## Libuv
NodeJS中v8引擎将JS代码解析后调用Node API，然后Node API将任务交给Libuv去分配，最后再将执行结果返回给v8引擎。

在Libuv中实现了一套事件循环流程来管理这些任务的执行，所以NodeJS的事件循环主要实在Libuv中完成的。

## 事件循环阶段

+ 1.timer阶段：执行所有的 setTimeout 和 setInterval 回调，并且由 poll 阶段控制
+ 2.pending callbacks 阶段：某些操作系统的回调，比如：TCP 链接错误。除了 timers、close、setImmediate 的其他大部分回调都在此阶段执行。
+ 3. 闲置阶段(idle, prepare)：仅系统内部使用。
+ 4.poll阶段：轮询等待新的链接和请求等事件，执行 I/O 回调等。V8引擎将JS代码解析并传入Libuv 引擎后首先进入此阶段。
  
    如果此阶段任务队列已经执行完毕了，则进入 check 阶段执行 setImmediate 回调 （如果有 setImmediate 的话）。
  
    在等待新的任务时，如果有 timers 计时器到期，则会直接进入 timers 阶段。 此阶段可能会阻塞等待。
  
+ 5.check阶段：执行setImmediate 的回调函数
+ 6.close callback 阶段：关闭回调执行，如 socket.on('close')等

以上每个阶段都回去执行完当前阶段的任务队列，然后继续执行当前阶段的微任务队列，只有当前阶段所有的微任务都执行完了，才会进入下一个阶段。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709951e65ffe00e~tplv-t2oaga2asx-watermark.awebp)

## 测试一下
### 测试一
```js
const fs = require('fs');

fs.readFile(__filename, data => {
    // poll（I/O回调） 阶段
  console.log('readFile')
  
  Promise.resolve().then(() => {
    console.error('promise1')
  })
  Promise.resolve().then(() => {
    console.error('promise2')
  })
});

setTimeout(() => {
    // timers 阶段
  console.log('timeout');
  Promise.resolve().then(() => {
    console.error('promise3')
  })
  Promise.resolve().then(() => {
    console.error('promise4')
  })
})

// 阻塞一下，保证上面的异步任务准备完毕
var startTime = new Date().getTime();
var endTime = startTime;
while(endTime - startTime < 1000) {
    endTime = new Date().getTime()
}
```

最终输出：
```shell
timeout
promise3
promise4
readFile
promise1
promise2
```

### 测试二
与浏览器不同，在timers阶段里面的宏任务、微任务在不同版本node中表现不同：
```js
setTimeout(() => {
  console.log('setTimeout1');
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)

setTimeout(() => {
  console.log('setTimeout2');
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
```
Node11之前，最终输出：
```shell
setTimeout1
setTimeout2
promise1
promise2
```

Node11之后，最终输出：（此时和浏览器测试一致）
```shell
setTimeout1
promise1
setTimeout2
promise2
```

### 测试三

至于 process.nextTick(), 它的执行时机比promise.then()还早，在同步人物之后，其他所有异步任务之前，会优先执行process.nextTick。

可以想象是吧process.nextTick放在当前循环的尾部，与promise.then()类似，但还在promise.then()更前面。

> process.nextTick 是一个独立于 eventLoop 的任务队列。
> 
```js
setTimeout(() => {
    console.log('setTimeout');
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})
process.nextTick(() => {
  console.log('process')
})

```

最终输出：
```shell
process
promise
setTimeout
```

### 测试四
```js
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
```


最终输出：
```shell
process
promise
setTimeout
setImmediate
```
为什么setImmediate最后执行呢？

setTimeout处于timer阶段，setImmediate处于check阶段。

第一轮循环之后，首先执行完process.nextTick 、
Promise，然后分别将setImmediate和setTimeout加入了各自阶段的任务队列。

第二轮循环后，首先进入 timer 阶段，执行setTimeout回调；然后pending callbacks 和 poll 阶段没有任务，因此进入 check 阶段 执行 setImmediate回调。

### 测试五

```js
setImmediate(() => {
    console.log('timeout1')
    Promise.resolve().then(() => console.log('promise resolve'))
    process.nextTick(() => console.log('next tick1'))
});
setImmediate(() => {
    console.log('timeout2')
    process.nextTick(() => console.log('next tick2'))
});
setImmediate(() => console.log('timeout3'));
setImmediate(() => console.log('timeout4'));
```
+ 在 node11 之前，因为每一个 eventLoop 阶段完成后会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行，因此上述代码是先进入 check 阶段，执行所有 setImmediate，完成之后执行 nextTick 队列，最后执行微任务队列，因此输出为timeout1=>timeout2=>timeout3=>timeout4=>next tick1=>next tick2=>promise resolve
  
+ 在 node11 之后，process.nextTick 是微任务的一种,因此上述代码是先进入 check 阶段，执行一个 setImmediate 宏任务，然后执行其微任务队列，再执行下一个宏任务及其微任务,因此输出为timeout1=>next tick1=>promise resolve=>timeout2=>next tick2=>timeout3=>timeout4

> node11 之后一些特性已经向浏览器看齐
> 


> [说说事件循环机制](https://juejin.cn/post/6844904079353708557)
> 
> [了解 process.nextTick()](http://nodejs.cn/learn/understanding-process-nexttick)