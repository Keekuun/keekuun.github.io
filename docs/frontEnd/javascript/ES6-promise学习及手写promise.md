---
title: 【JS】ES6-promise学习及手写promise
date: 2019-10-05
categories: 
- 前端
tags: 
- JS
- ES6
- promise
---

![image](https://upload-images.jianshu.io/upload_images/16584865-51b28b6040255172.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 1. promise要解决的问题：

脑筋急转弯：把牛关进冰箱里，要分几步？

```js
// 第一步，打开冰箱
function open(){
    setTimeout(()=>{
        console.log('打开冰箱');
        return 'success';
    }, 1000)
}

// 第二步，放牛进去
function settle(){
      setTimeout(()=>{
       console.log('放牛进去');
       return 'success';
    }, 3000)
}

// 第三步，关上冰箱
function close(){
      setTimeout(()=>{
       console.log('关上冰箱');
       return 'success';
    }, 1000)
}

function closeCow(){
    open();
    settle();
    close()
}

closeCow();

//"打开冰箱"
//"关上冰箱"？
//"放牛进去"？
```

很显然，这三个操作不能颠倒顺序，否则任务就会失败。但是上述逻辑并不能保证最终是按照我们想要的顺序进行，显然,难点在于第二步，花费的时间更长。为了保证第二步在第一步执行成功之后再执行，第三步在第二步执行成功之后在执行，改进：

```js
function closeCow() {
	setTimeout(() => {
		console.log("打开冰箱");
		setTimeout(() => {
			console.log("放牛进去");
			setTimeout(() => {
				console.log("关闭冰箱");
			}, 1000);
		}, 3000);
	}, 1000);
}
```

这样的确解决了问题，但是看起来很别扭，逻辑不清晰，这就是经典的“回调地狱”。在过去，要想做多重的异步操作，会导致经典的回调地狱，promise的出现，就是为了解决这个问题的。

**Promise**对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。

```js
let closeCow = new Promise((resolve, reject) => {
    console.log('把牛放进冰箱');
    resolve();
});
closeCow
    .then(open())   // 打开冰箱
    .then(settle()) // 放牛进去
    .then(close()); // 关上冰箱
```

这就是promise最简单的应用。

## 2. promise深入了解

### 2.1 Promise状态

[图片上传失败...(image-5bcc4b-1570631381694)]

+ **Pending(待处理)**: promise初始化的状态，正在运行，既没有完成也没有失败的状态，此状态可以提升为**fulfilled** 和 **rejected**状态

+ **Fulfilled(已完成)**: 如果回调函数实现Promise的`resolve`（回调函数），那么state变为`fulfilled`。

+ **Rejected(已拒绝)**: 如果Promise调用过程中遭到拒绝或发生异常，state就会处于`rejected`状态。

+ **Settled(不变的)**: Promise从`pending`状态提升后，状态要么变为`fulfilled`，要么变为`rejected`,没有其他情况。

  Promise 的状态一旦改变，就永久保持该状态，不会再变了。

### 2.2 promise实例方法

所谓实例方法（instance method）就是必须实例化之后才能调用的方法，在JS中表现为使用`new`关键字实例化之后才能调用的，是定义在原型上的方法，即`Promise.prototype.methodName`;

+ [`Promise.prototype.then(onFulfilled, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then): 用来注册当状态变为`fulfilled`或者`reject`时的回调函数

  ```js
  // onFulfilled 是用来接收promise成功的值
  // onRejected 是用来接收promise失败的原因
  promise.then(onFulfilled, onRejected);
  ```

  注意，`then`方法是异步执行的，`onFulfilled`和`onRejected`方法只会执行其中一个，因为promise状态是单向变化的，要么`fulfilled`、要么`rejected`:

  案例一：

  ```js
  const promise = new Promise((resolve, reject) => {
      resolve('fulfilled...'); // 状态由 pending --> fulfilled
  });
  
  promise.then(res => {
      console.log(res); // 只会调用 onFulfilled
  }, err => {
      console.log(err); // 不会调用 rejected
  })
  // fulfilled
  ```

  案例二：

  ```js
  const promise = new Promise((resolve, reject) => {
      reject('rejected...'); // 状态由 pending --> rejected
  });
  
  promise.then(res => {
      console.log(res); // 不会调用 onFulfilled
  }, err => {
      console.log(err); // 只会调用 rejected
  })
  // rejected
  ```

  案例三：

  ```js
  const promise1 = new Promise((resolve, reject) => {
      resolve('fulfilled...'); // 状态先由 pending --> rejected
      reject('rejected...'); //  状态不会再变 pending --> rejected
  });
  
  promise1.then(res => {
      console.log(res); // 只会调用 onFulfilled
  }, err => {
      console.log(err); // 不会调用 rejected
  })
  // fulfilled
  
  const promise2 = new Promise((resolve, reject) => {
      reject('rejected...'); // 状态先由 pending --> rejected
      resolve('fulfilled...'); // 状态不会再变 pending --> rejected
  });
  
  promise2.then(res => {
      console.log(res); // 不会调用 onFulfilled
  }, err => {
      console.log(err); // 只会调用 rejected
  })
  // rejected
  ```

  通过以上三个案例，我们发现，promise状态一旦由pending提升为fulfilled或rejected就不会再改变了，只能单向变化；并且then方法中只会调用其中一个方法（成功的回调或者事变的回调），不会二者都调用。

  ```js
  Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log)
  
  // 输出 1
  ```

  Promise的then方法的参数期望是函数，传入非函数则会发生**值穿透**。

+ [`Promise.prototype.catch(onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch): catch在链式写法中可以**捕获前面then中发送的异常**。

  ```js
  promise.then(res => {
     console.log('haha');
     return 'haha'
  }).then(res => {
      throw new Error('hehe'); // 此处错误被捕获
  }).catch(err => {
      console.log(err)
  })
  
  promise.then(res => {
      console.log('haha');
      throw new Error('haha'); // 此处错误被捕获
  }).then(res => {
      console.log('hehe');
      throw new Error('hehe'); // 此处不会执行
  }).catch(err => {
      console.log(err)
  })
  ```

  　　catch一旦捕获到了一个then中的错误，后续的then方法就不会再执行下去了。其实，**catch**相当于**then(null,onRejected)**,前者只是后者的语法糖而已，使用catch方法替代更好吧。

+ [`Promise.prototype.finally(onFinally)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally): 无论当前promise的状态是完成(fulfilled)还是失败(rejected)都会执行的回调，并且返回新的promise对象。

  ```js
  promise.then(res => {
      throw new Error('test');
  }).catch(errr => {
      console.log(err);
  }).finally(()=>{
      // 返回状态为(resolved 或 rejected)都会执行
      console.log('当前promise执行结束')
  });
  ```

  ```js
  let isLoading = true;
  fetch(myRequest).then(function(response) {
      let contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    })
    .then(function(json) { /* process your JSON further */ })
    .catch(function(error) { console.log(error); })
    .finally(function() { isLoading = false; });
  ```

+ `Promise.prototype.constructor`: 返回被创建的实例函数.  默认为 Promise 函数.

### 2.3 promise静态方法

所谓静态方法（static method）就是可以直接通过对象调用，而不用实例化的方法，即`Promise.methodName()`;

+ [`Promise.resolve(value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve):返回一个状态由给定value(可以是普通值，也可以是promise对象)决定的Promise对象。如果value是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定，否则返回成功的promise对象（状态为fulfilled）

+ [`Promise.reject(reason)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject):返回一个状态为失败(rejected)的Promise对象，并将给定的失败信息传递给对应的处理方法

+ [`Promise.all(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all): **一损俱损**，只要一个失败，就返回新的pomise对象,否则就等待所有的状态提升为fulfilied。“团结”

  用于处理多个promise对象的状态集合,集合中可以传入常数，当做成功的promise返回值。当集合中一旦有一个promise转改变为rejected，all的状态就变为rejected：

  ```js
  const p1 = Promise.resolve(1);
  const p2 = Promise.resolve(2);
  const p3 = Promise.reject(3);
  const p4 = Promise.resolve(4);
  // 没有错误
  Promise.all([p1,p2,33, p4]).then(res => {
      console.log(res); // [1,2,33,4]
  })
  // 有错误
  Promise.all([p1,p2,p3, 33, p4]).then(res => {
      console.log(res); // 只要发现一个错误，就不会执行fulfilled方法
  }).catch(err => {
      console.log(err); // 执行错误，输出3
  })
  ```

  当集合中所有的promise状态都为fulfilled时，必须等待所有的promise执行完毕,即所有的promise对象状态都提升为fulfilled再返回新dePromise对象，执行then方法。

+ [`Promise.race(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race): **一荣俱荣**，只要一个状态改变（fulfilled或reject），就返回新的promise对象。“赛跑”

  用于处理多个promise对象的状态集合,集合中可以传入常数，当做成功的promise返回值。当集合中一旦有一个promise转改变为fulfilled或rejected，all的状态就提升：

  ```js
  Promise.race([p1,p2,33,p4]).then(res=> {
      console.log(res); // 只会输出其中一个状态成功改变的，输出：1
  });
  
  Promise.race([p1,p2,p3, 33,p4]).then(res=> {
      console.log(res); // 虽然p3出错了，但是p1状态先提升，只会执行状态最先提升的，输出：1
  }).catch(err => {
      console.log(err);// 这里不会执行
  });
  ```

+ *`Promise.any(iterable)`: **处于提案中**。。。只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。

  手动实现如下：

  ```js
  Promise.any = function(arr) {
      var self = this;
      return new Promise(function(resolve, reject){
          var errors = [];
          var count = 0;
          var len = arr.length;
          for(var i=0;i<len;i++){
              // 只要有一个实例状态变为fulfilled，新的Promise状态就会改变为fulfilled
              self.resolve(arr[i]).then(function(res){
                  resolve(res);
              }, function(err){
                  errors[count] = err;
                  count++;
                  // 否则等待所有的rejected,新的Promise状态才会改变为rejected
                  if(count === len){
                      reject(errors)
                  }
              })
          }
      })
  }
  ```

  

+ *[`Promise.allSettled(iterable)`](https://github.com/tc39/proposal-promise-allSettled): **ES2020将实现**。。。 只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。不关心结果，只关心有没有执行完毕，该方法返回的新的 Promise 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`

  手动实现如下：

  ```js
  Promise.allSettled = function(arr){
      var results = [];
      var len = arr.length;
      for(var i=0;i<len;i++){
          this.resolve(arr[i]).then(function(res){
              results.push({status:'fulfilled', value: res});
          }, function(err){
              results.push({status:'rejected', value: err});
          })
      }
      // 一旦结束，状态总是`fulfilled`，不会变成`rejected`
      return new Promise(function(resolve, reject) {
         resolve(results)
      })
  }
  ```

+ *`Promise.try()`:事实上，`Promise.try`就是模拟`try`代码块，就像`promise.catch`模拟的是`catch`代码块。

  需求的提出：

    不论函数`f`是同步函数还是异步操作，但是想用 Promise 来处理它：

  ```js
  Promise.resolve().then(f).catch()
  ```

  ​	但是，如果`f`是同步函数，那么它会在本轮事件循环的末尾执行。

  ```js
  const f = () => console.log('now');
  Promise.resolve().then(f);
  console.log('next');
  // next
  // now
  ```

  有没有方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API捕获错误：

  ```js
  const f = () => console.log('now');
  (
    () => new Promise(
      resolve => resolve(f())
    )
  )();
  console.log('next');
  // now
  // next
  
  // 或者
  (async () => f())();
  console.log('next');
  // now
  // next
  ```

  用`Promise.try`替代上面的代码：

  ```js
  const f = () => console.log('now');
  Promise.try(f);
  console.log('next');
  // now
  // next
  ```

  手动实现如下：

  ```js
  Promise.try = function(fn){
      if(typeof fn !== 'function') return;
      return new Promise(function(resolve, reject) {
          return resolve(fn());
      })
  }
  ```

### 2.3 promise属性

+ `Promise.length`：length属性，其值总是1（构造器参数的数目）
+ `Promise.prototype`：`Promise`构造器的原型

## 3. JS事件执行机制(Event Loop)

为了更好地理解promise的应用，先需要理解JS执行机制。

**运行时概念**：

+ 函数调用形成了一个栈帧 （call stack）。

+ 对象被分配在一个堆（heap）中，即用以表示一大块非结构化的内存区域。

+ 所有的异步操作都会进入队列（queue）中等待被执行。

  [图片上传失败...(image-11921a-1570631381694)]

一个 JavaScript 运行时包含了一个待处理的**消息队列**。每一个消息都关联着一个用以处理这个消息的函数。

函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）。

**事件循环机制**：

[图片上传失败...(image-d11d0d-1570631381694)]

JS执行时，将任务分为**同步任务**和**异步任务**，同步任务都在主线程上执行（主代码块），形成一个执行栈，异步任务会被加入到任务队列里面。

任务队列中的任务分为两种任务类型：**macrotask和microtask**，**任务队列里面微任务优先于宏任务执行**，先执行完任务队列里面所有的微任务，然后再执行任务队列里面的宏任务。

- **宏任务**：script(主代码块), `setTimeout,` `setInterval`, `setImmediate`, `I/O`, UI rendering，MessageChannel、setImmediate(Node.js 环境)。每次执行栈执行的代码就是一个宏任务

- **微任务**：`process.nextTick`（nodejs相关）, `Promise`, `Object.observer`, `MutationObserver`。**在当前宏任务（主线程） 执行结束后立即执行的任务**

  [图片上传失败...(image-6695ba-1570631381694)]

JS运行机制：

+ 执行栈中的宏任务（栈中没有就从事件队列中获取）,一般首先执行普通代码块（script）

+ 执行过程中如果遇到微任务，就将它添加到微任务队列中

+ 当前宏任务执行完毕后，立即执行当前微任务队列中的**所有**微任务（依次执行）

+ 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染

+ 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取），以此循环...

   ![JS运行机制](https://upload-images.jianshu.io/upload_images/16584865-35322b2ebe0e72e3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 参考：
>
> + **[JS事件循环机制可视化视频](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)**
> + [JS中的事件循环与定时器]([https://blog.kaolafed.com/2015/12/01/JS%E4%B8%AD%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E4%B8%8E%E5%AE%9A%E6%97%B6%E5%99%A8/](https://blog.kaolafed.com/2015/12/01/JS中的事件循环与定时器/))
> + [JavaScript 异步、栈、事件循环、任务队列](https://segmentfault.com/a/1190000011198232)
> + [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://juejin.im/post/5a6547d0f265da3e283a1df7#heading-6)
> + [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
> + [从一道题浅说 JavaScript 的事件循环](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)

## 4. promise测试题

### 4.1 示例一：

```js
new Promise(resolve => {
// promise构造函数里面是同步代码区，和普通代码块一样
    console.log(5);
    resolve(1);
    
    Promise.resolve().then(() => {
        console.log(2)
    });
    console.log(4)
}).then(t => {
    console.log(t)
}).catch(()=>{
    console.log(6);
}).finally(() =>{
    console.log(0);
});
console.log(3);
```

<details>
    <summary>输出结果</summary>
    <pre>5 4 3 2 1 0</pre>
</details>

### 4.2 示例二：

```js
console.log('script start'); // 宏任务1

setTimeout(function() {
  console.log('setTimeout'); // 宏任务2
}, 0);

Promise.resolve().then(function() { 
  console.log('promise1');// 微任务1
}).then(function() {
  console.log('promise2'); // 微任务1
});

console.log('script end'); // 宏任务1
```

<details>
  <summary>输出结果</summary>
  <pre>
    script start
    script end
    promise1
    promise2
    setTimeout
  </pre>
</details>

### 4.3 示例三：

```js
let p1 = new Promise((resolve,reject)=>{
  let num = 6
  if(num<5){
    console.log('resolve1')
    resolve(num)
  }else{
    console.log('reject1')
    reject(num)
  }
})
p1.then((res)=>{
  console.log('resolve2')
  console.log(res)
},(rej)=>{
  console.log('reject2')
  let p2 = new Promise((resolve,reject)=>{
    if(rej*2>10){
      console.log('resolve3')
      resolve(rej*2)
    }else{
      console.log('reject3')
      reject(rej*2)
    }
  })
　　return p2
}).then((res)=>{
  console.log('resolve4')
  console.log(res)
},(rej)=>{
  console.log('reject4')
  console.log(rej)
})
```

<details>
    <summary>输出结果</summary>
    <pre>
    reject1
    reject2
    resolve3
    resolve4
    12
    </pre>
</details>

### 4.4 示例四：

> [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

<iframe height="302" style="width: 100%;" scrolling="no" title="ES6-promise-demo3" src="https://codepen.io/keekuun/embed/abbzjbM?height=302&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/abbzjbM'>ES6-promise-demo3</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<details>
  <summary>点击内部输出</summary>
  <pre>
    click
    promise
    mutate
    click
    promise
    mutate
    timeout
    timeout
  </pre>
</details>

### 4.5 示例五：

> [从event loop到async await来了解事件循环机制](https://juejin.im/post/5c148ec8e51d4576e83fd836)

```js
async function a1 () { // async关键字
    console.log('a1 start')
    await a2() // await关键字
    console.log('a1 end')
}
async function a2 () {
    console.log('a2')
}

console.log('script start')

setTimeout(() => {
    console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
    console.log('promise1')
})

a1()

let promise2 = new Promise((resolve) => {
    resolve('promise2.then')
    console.log('promise2')
})

promise2.then((res) => {
    console.log(res)
    Promise.resolve().then(() => {
        console.log('promise3')
    })
})
console.log('script end')
```

<details>
    <summary>输出结果</summary>
    <pre>
    script start
    a1 start
    a2
    promise2
    script end
    promise1
    a1 end
    promise2.then
    promise3
    setTimeout
    </pre>
</details>

### 4.6 示例五：

```js
async function test() { 
    console.log('test start'); 
    await undefined; 
    console.log('await 1'); 
    await new Promise(resolve => {  
        console.log('promise in async'); 
        resolve(); 
    }); 
    console.log('await 2'); 
} 
 
test(); 
new Promise((resolve) => { 
    console.log('promise'); 
    resolve(); 
}) 
.then(() => {console.log(1)}) 
.then(() => {console.log(2)}) 
.then(() => {console.log(3)}) 
.then(() => {console.log(4)});
```

<details>
    <summary>输出结果</summary>
    <pre>
    test start
    promise
    await 1
    promise in async
    1
    await 2
    2
    3
    4
    </pre>
</details>

## 5. 手写promise

+ 使用ES5之前的语法实现：

```js
(function () {
    // 判断function
    function isFunction(fn) {
        return typeof fn === 'function';
    }

    // 状态 pending、fulfilled、rejected
    var PENDING = 'pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';

    // 构造方法
    var Kromise = function (handle) {
        // 当前状态
        this._status = PENDING;
        // 添加成功回调队列
        this._fulfilledQueue = [];
        // 添加失败回调队列
        this._rejectedQueue = [];
        // 引用当前this对象
        var self = this;

        if (!isFunction(handle)) {
            throw new Error('Parameter handle is not a function！')
        }

        // 添加resolve时执行的函数
        function _resolve(val) {
            var run = function () {
                if (self._status !== PENDING) return;
                // 依次执行成功队列中的函数，并清空队列
                var runFulfilled = function (res) {
                    var resolve;
                    while (resolve = self._fulfilledQueue.shift()) { // 出栈
                        resolve(res);
                    }
                };

                // 依次执行失败队列中的函数，并清空队列
                var runRejected = function (err) {
                    var reject;
                    while (reject = self._rejectedQueue.shift()) { // 出栈
                        reject(err);
                    }
                };
                /* 如果resolve的参数为Kromise对象，则必须等待该Kromise对象状态改变后,
                 * 当前Kromise的状态才会改变，且状态取决于参数Kromise对象的状态
                 */
                if (val instanceof Kromise) {
                    val.then(function (value) {
                        self._status = FULFILLED;
                        self._value = value;
                        runFulfilled(value)
                    }, function (err) {
                        self._status = REJECTED;
                        self._value = err;
                        runRejected(err);
                    })
                } else {
                    self._status = FULFILLED;
                    self._value = val;
                    runFulfilled(val);
                }

            };
            // 为了支持同步的Promise，这里采用异步调用
            setTimeout(run, 0)
        }

        // 添加reject时执行的函数
        function _reject(err) {
            var run = function () {
                if (self._status !== PENDING) return;
                // 依次执行成功队列中的函数，并清空队列
                self._status = REJECTED;
                self._value = err;
                var reject;
                while (reject = self._fulfilledQueue.shift()) { // 出栈
                    reject(err);
                }
            };
            // 为了支持同步的Promise，这里采用异步调用
            setTimeout(run, 0)
        }

        // 执行handle,捕获异常
        try {
            handle(_resolve.bind(this), _reject.bind(this));
        } catch (e) {
            _reject(e);
        }
    };

    // 属性
    Kromise.length = 1;

    // 实例方法
    // 实现then方法
    Kromise.prototype.then = function (onFulfilled, onRejected) {
        var self = this;
        // 返回一个新的Kromise对象
        return new Kromise(function (onFulfilledNext, onRejectedNext) {
            // 成功时的回调
            var fulfilled = function (val) {
                try {
                    // 如果不是函数，值穿透
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(val)
                    } else {
                        var res = onFulfilled(val);
                        // 如果当前回调函数返回Kromise对象，必须等待其状态改变后在执行下一个回调
                        if (res instanceof Kromise) {
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (e) {
                    // 如果函数执行出错，新的Kromise对象的状态为失败
                    onRejectedNext(e);
                }
            };
            // 失败时的回调
            var rejected = function (err) {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(err)
                    } else {
                        var res = onRejected(err);
                        if (res instanceof Kromise) {
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            onFulfilledNext(res);
                        }
                    }
                } catch (e) {
                    onRejectedNext(e)
                }
            };

            switch (self._status) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case PENDING:
                    self._fulfilledQueue.push(fulfilled);
                    self._rejectedQueue.push(rejected);
                    break;
                // 当状态已经改变时，立即执行对应的回调函数
                case FULFILLED:
                    fulfilled(self._value);
                    break;
                case REJECTED:
                    rejected(self._value);
                    break;
            }
        });
    };

    // 实现catch方法
    Kromise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    // 实现finally方法
    Kromise.prototype.finally = function (onFinally) {
        return this.then(function (value) {
            Kromise.resolve(onFinally()).then(function () {
                return value;
            })
        }, function (err) {
            Kromise.resolve(onFinally()).then(function () {
                throw new Error(err);
            })
        })
    };

    // 静态方法
    // 实现resolve方法
    Kromise.resolve = function (value) {
        // 如果参数是Kromise实例，直接返回这个实例
        if (value instanceof Kromise) {
            return value;
        }
        return new Kromise(function (resolve) {
            resolve(value)
        })
    };
    // 实现reject方法
    Kromise.reject = function (value) {
        return new Kromise(function (resolve, reject) {
            reject(value)
        })
    };
    // 实现all方法
    Kromise.all = function (arr) {
        var self = this;
        return new Kromise(function (resolve, reject) {
            var values = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                // 数组参数如果不是Kromise实例，先调用Kromise.resolve
                self.resolve(arr[i]).then(function (res) {
                    values.push(res);
                    // 所有状态都变成fulfilled时返回的Kromise状态就变成fulfilled
                    if (values.length === arr.length) {
                        resolve(values);
                    }
                }, function (e) {
                    // 有一个被rejected时返回的Kromise状态就变成rejected
                    reject(e);
                })
            }
        })
    };

    // 实现race方法
    Kromise.race = function (arr) {
        var self = this;
        return new Kromise(function (resolve, reject) {
            for (var i = 0, len = arr.length; i < len; i++) {
                // 只要有一个实例率先改变状态，新的Kromise的状态就跟着改变
                self.resolve(arr[i]).then(function (res) {
                    resolve(res);
                }, function (err) {
                    reject(err);
                })
            }
        })
    };
    // 实现any方法
    Kromise.any = function (arr) {
        var self = this;
        return new Kromise(function (resolve, reject) {
            var count = 0;
            var errors = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                // 只要有一个实例状态变为fulfilled，新的Kromise状态就会改变为fulfilled
                self.resolve(arr[i]).then(function (res) {
                    resolve(res);
                }, function (err) {
                    errors[count] = err;
                    count++;
                    // 否则等待所有的rejected,新的Kromise状态才会改变为rejected
                    if (count === arr.length) {
                        reject(errors);
                    }
                })
            }
        })

    };
    // 实现allSettled方法
    Kromise.allSettled = function (arr) {
        var results = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            this.resolve(arr[i]).then(function (res) {
                results.push({status: FULFILLED, value: res});
            }, function (err) {
                results.push({status: REJECTED, value: err});
            })
        }
        // 一旦结束，状态总是`fulfilled`，不会变成`rejected`
        return new Kromise(function (resolve, reject) {
            resolve(results)
        })
    };
    // 实现try方法
    Kromise.try = function (fn) {
        if (!isFunction(fn)) return;
        return new Kromise(function (resolve, reject) {
            return resolve(fn());
        })
    };

    // 挂载
    window.Kromise = Kromise;
})();

```

+ 使用ES6 class语法实现

```js
  // 判断变量否为function
  const isFunction = variable => typeof variable === 'function'
  // 定义Promise的三种状态常量
  const PENDING = 'PENDING'
  const FULFILLED = 'FULFILLED'
  const REJECTED = 'REJECTED'

  class MyPromise {
    constructor (handle) {
      if (!isFunction(handle)) {
        throw new Error('MyPromise must accept a function as a parameter')
      }
      // 添加状态
      this._status = PENDING
      // 添加状态
      this._value = undefined
      // 添加成功回调函数队列
      this._fulfilledQueues = []
      // 添加失败回调函数队列
      this._rejectedQueues = []
      // 执行handle
      try {
        handle(this._resolve.bind(this), this._reject.bind(this)) 
      } catch (err) {
        this._reject(err)
      }
    }
    // 添加resovle时执行的函数
    _resolve (val) {
      const run = () => {
        if (this._status !== PENDING) return
        // 依次执行成功队列中的函数，并清空队列
        const runFulfilled = (value) => {
          let cb;
          while (cb = this._fulfilledQueues.shift()) {
            cb(value)
          }
        }
        // 依次执行失败队列中的函数，并清空队列
        const runRejected = (error) => {
          let cb;
          while (cb = this._rejectedQueues.shift()) {
            cb(error)
          }
        }
        /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
          当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
        */
        if (val instanceof MyPromise) {
          val.then(value => {
            this._value = value
            this._status = FULFILLED
            runFulfilled(value)
          }, err => {
            this._value = err
            this._status = REJECTED
            runRejected(err)
          })
        } else {
          this._value = val
          this._status = FULFILLED
          runFulfilled(val)
        }
      }
      // 为了支持同步的Promise，这里采用异步调用
      setTimeout(run, 0)
    }
    // 添加reject时执行的函数
    _reject (err) { 
      if (this._status !== PENDING) return
      // 依次执行失败队列中的函数，并清空队列
      const run = () => {
        this._status = REJECTED
        this._value = err
        let cb;
        while (cb = this._rejectedQueues.shift()) {
          cb(err)
        }
      }
      // 为了支持同步的Promise，这里采用异步调用
      setTimeout(run, 0)
    }
    // 添加then方法
    then (onFulfilled, onRejected) {
      const { _value, _status } = this
      // 返回一个新的Promise对象
      return new MyPromise((onFulfilledNext, onRejectedNext) => {
        // 封装一个成功时执行的函数
        let fulfilled = value => {
          try {
            if (!isFunction(onFulfilled)) {
              onFulfilledNext(value)
            } else {
              let res =  onFulfilled(value);
              if (res instanceof MyPromise) {
                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                onFulfilledNext(res)
              }
            }
          } catch (err) {
            // 如果函数执行出错，新的Promise对象的状态为失败
            onRejectedNext(err)
          }
        }
        // 封装一个失败时执行的函数
        let rejected = error => {
          try {
            if (!isFunction(onRejected)) {
              onRejectedNext(error)
            } else {
                let res = onRejected(error);
                if (res instanceof MyPromise) {
                  // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                  res.then(onFulfilledNext, onRejectedNext)
                } else {
                  //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                  onFulfilledNext(res)
                }
            }
          } catch (err) {
            // 如果函数执行出错，新的Promise对象的状态为失败
            onRejectedNext(err)
          }
        }
        switch (_status) {
          // 当状态为pending时，将then方法回调函数加入执行队列等待执行
          case PENDING:
            this._fulfilledQueues.push(fulfilled)
            this._rejectedQueues.push(rejected)
            break
          // 当状态已经改变时，立即执行对应的回调函数
          case FULFILLED:
            fulfilled(_value)
            break
          case REJECTED:
            rejected(_value)
            break
        }
      })
    }
    // 添加catch方法
    catch (onRejected) {
      return this.then(undefined, onRejected)
    }
    // 添加静态resolve方法
    static resolve (value) {
      // 如果参数是MyPromise实例，直接返回这个实例
      if (value instanceof MyPromise) return value
      return new MyPromise(resolve => resolve(value))
    }
    // 添加静态reject方法
    static reject (value) {
      return new MyPromise((resolve ,reject) => reject(value))
    }
    // 添加静态all方法
    static all (list) {
      return new MyPromise((resolve, reject) => {
        /**
         * 返回值的集合
         */
        let values = []
        let count = 0
        for (let [i, p] of list.entries()) {
          // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
          this.resolve(p).then(res => {
            values[i] = res
            count++
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === list.length) resolve(values)
          }, err => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err)
          })
        }
      })
    }
    // 添加静态race方法
    static race (list) {
      return new MyPromise((resolve, reject) => {
        for (let p of list) {
          // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
          this.resolve(p).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        }
      })
    }
    finally (cb) {
      return this.then(
        value  => MyPromise.resolve(cb()).then(() => value),
        reason => MyPromise.resolve(cb()).then(() => { throw reason })
      );
    }
  }
```

