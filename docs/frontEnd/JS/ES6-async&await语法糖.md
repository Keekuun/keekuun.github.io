---
title: 【JS】ES6-async&await语法糖
date: 2019-10-06
sidebar: auto
categories: 
- 前端
tags: 
- JS
- ES6
- async
---

## 1. 认识async/await函数

还记得学习promise时候的脑筋急转弯吗？[“把牛放进冰箱里，要几步？”](https://docs.zkkysqs.top/frontEnd/javascript/ES6-promise%E5%AD%A6%E4%B9%A0%E5%8F%8A%E6%89%8B%E5%86%99promise.html#_1-promise%E8%A6%81%E8%A7%A3%E5%86%B3%E7%9A%84%E9%97%AE%E9%A2%98%EF%BC%9A])

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

前面使用prmoise解决如下：

```js
let closeCow = new Promise((resolve, reject) => {
    resolve();
})

closeCow.then(open()).then(settle()).then(close()); 
// 打开冰箱
// 关上冰箱?
// 放牛进去?
```

我们知道`Promise`属于微任务，`setTimeout`属于宏任务，在主代码块扫描过后，执行下一个任务的时候，会先把所有的微任务处理完，再处理宏任务，所以`Promise`（`.then`返回的就是Promise对象）会优先于`setTimeout`执行，但是当`setTimeout`里面等待时间更长的时候，显然等待时间短的先执行。也就是说，三个`.then`中的`setTimeout`依次进入宏任务队列里面等待执行。

这也就导致了上面的错误结果。

其实`Promise`和`setTimeout`都是异步操作的解决方案，这里错误的将二者混用了，导致第三个`.then`先于第二个`.then`执行，所以在使用`.then`链式调用的时候，最好不要在`.then`里面进行异步操作，否则可能会导致后面的`then`先执行。

下面去掉`.then`中的异步操作`setTimeout`：

```js
// 第一步，打开冰箱
function open(){
    console.log('打开冰箱');
    return 'success';
}

// 第二步，放牛进去
function settle(){
    console.log('放牛进去');
    return 'success';
}

// 第三步，关上冰箱
function close(){
    console.log('关上冰箱');
    return 'success';
}

Promise.resolve().then(open).then(settle).then(close);
```

我们还可以使用`function*`生成器：

```js
function* genCloseCow (){
    yield open();
    yield settle();
    return close();
}

let closeCow = genCloseCow();
closeCow.next();
close.next();
closeCow.next();
```

使用`async/await`方式如下： 

```js
async function asyncCloseCow(){
    await open();
    await settle();
    await close();
}

asyncCloseCow(); // 返回值 Promise {<resolved>: undefined}
```

> 如果，就是要保留`setTimeout`方法，又该怎么实现呢？请看后文。

其实`async/await`就是`function*`和`Promise`二者的结合：

`async`函数就是将 Generator 函数的星号（`*`）替换成`async`，将`yield`替换成`await`，并且返回`Promise`对象，可以链式调用`.then`方法。

+ 内置执行器：`function*`函数必须调用`.next`方法才能被唤醒执行，`async/await`可以像普通函数一样调用执行。
+ 语义化更好：`async/await`中`async`表示函数里有异步操作，`await`表示后面的代码要等待执行。而`function*`会让人迷惑。
+ 适用性更强：`function*`的`yield`命令后面只能跟[`Thunk函数`](http://www.ruanyifeng.com/blog/2015/05/thunk.html)（**传名调用**）或`Promise对象`，而`async/await`的`await`命令后面可以是 `Promise 对象`和`原始类型的值`（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

## 2. async/await函数使用形式

JS中由于函数的形式有很多种，故`async/await`的形式也有多种：

+ 函数申明式

  ```js
  async function foo(){}
  ```

+ 函数表达式

  ```js
  const foo = async function() {};
  ```

+ 箭头函数式

  ```js
  const foo = async () => {};
  ```

+ 对象方法

  ```js
  let obj = { async foo() {} };
  obj.foo().then(res => console.log(res));
  ```

+ Class 方法

  ```js
  class Foo {
      constructor(){};
      async foo(){};
  }
  
  const f = new Foo();
  f.foo();
  ```

## 3. async/await详解

### 3.1  async/await返回值

前面知道`async/await`方法执行之后返回一个Promise对象，那么函数内部的`return`呢？

`async`函数内部`return`语句返回的值，将被隐式地传递给`Promise.resolve`：

```js
async function hello() {
    return 'hello world!';
}

let h = hello(); // h --> Promise {<resolved>: "hello world!"}
h.then(res => console.log(res)); // hello world!
```

返回值`隐式的传递给`[`Promise.resolve`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)，并不意味着`return await promiseValue;和return promiseValue;`在功能上相同：

```js
async function bar1(){
    return foo;
}
async function bar2(){
    return await foo;
}
```

`return foo;`和`return await foo;`有一些细微的差异：

`return foo;`不管`foo`是promise还是rejects都将会直接返回`foo。相反地，`如果`foo`是一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，`return await foo;`将等待`foo`执行(resolve)或拒绝(reject)，如果是拒绝，将会在返回前抛出异常。

### 3.2  async/await状态和错误处理

既然`async/await`方法执行之后返回一个Promise对象，那么这个Promise对象状态又是如何变化的呢？

`async`函数返回的 Promise 对象，必须等到内部所有`await`命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作（Promise异步操作 ，不是setTimeout）执行完，才会执行`then`方法指定的回调函数。

```js
let hello = () => Promise.resolve('hello await');
async function sayHi() {
    let hello = await hello();
    return hello;
}

sayHi().then(res => console.log(res));
```

任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行：

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

`await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到：

```javascript
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个`await`放在`try...catch`结构里面，这样不管这个异步操作是否成功，第二个`await`都会执行。

```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```

另一种方法是`await`后面的 Promise 对象再跟一个`catch`方法，处理前面可能出现的错误。

```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

### 3.3 await 关键字

这个关键字是`async/await`的核心，后面可以跟`Promise 对象`和`原始类型的值`（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）或者 `thenable对象`（实现了Promise的then方法）。

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```js
async function f() {
    // 相当于return 123
    return await 123;
}
f().then(res => console.log(res));
```

sleep睡眠函数：

```js
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

(async function foo() {
    for(let i=0; i<5;i++){
        console.log(i);
        await sleep(1000);
    }
})()
```

下面代码中，`await`命令后面是一个`Sleep`对象的实例。这个实例不是 Promise 对象，但是因为定义了`then`方法，`await`会将其视为`Promise`处理。

```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
    // 定义then方法
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

前面"把牛关进冰箱"案例里面使用`setTimeout`导致顺序错乱问题，下面来解决：

```js
// 打开冰箱
function open(){
    return new Promise(resolve => {
        setTimeout(()=>{
            console.log('打开冰箱');
            resolve(); // 等待时间结束，再提升状态
        }, 1000);
    })
}

// 放牛进去
function settle(){
    return new Promise(resolve => {
        setTimeout(()=>{
            console.log('放牛进去');
            resolve(); // 等待时间结束，再提升状态
        }, 3000);
    })
}

// 关闭冰箱
function close(){
    return new Promise(resolve => {
        setTimeout(()=>{
            console.log('关闭冰箱');
            resolve(); // 等待时间结束，再提升状态
        }, 1000);
    })
}

async function closeCow() {
    await open();
    await settle();
    await close()
}
closeCow();
// 打开冰箱
// 放牛进去
// 关闭冰箱
```

这里使用`setTimeout`能成功解决前面的问题的原因：

+ 三个方法返回的都是`promise`对象。
+ `await`后面跟Promise对象的时候，`await`语句后面的代码必须等待当前Promise状态提升为`resolved`状态(`reject`报错之后，后面的await不会执行），才会继续执行。
+ 三个方法均把`resolve`方法放在`setTimeout`里面，即必须等待时间结束，当前Promise状态才会被提升。

通过这个方式，我们就严格保证了三个方法按照顺序执行了异步操作（`setTimeout`）。

但是，当我们多个方法不需要严格的执行顺序的时候,我们其实可以这样并发执行：

```js
(async function () {

    let foo = await getFoo();
    let bar = await getBar();
    
    // 写法一
    let [foo1, bar1] = await Promise.all([getFoo(), getBar()]);
    
    // 写法二
    let fooPromise = getFoo();
    let barPromise = getBar();
    let foo2 = await fooPromise;
    let bar2 = await barPromise;})()
```



## 4. async/await实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
async function fn(args) {}
// 等同于
function fn(args) {
    return spawn(function* (){});
}
```

所有的`async`函数都可以写成上面的第二种形式，其中的`spawn`函数就是自动执行器：

```js
function spawn(genF) {
    return new Promise(function(resolve, reject) {
        const gen = genF();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch(e){
                return reject(e);
            }
            if(next.done){
                return resolve(next.value)
            }
            Promise.resolve(next.value).then(function(v){
                step(function(){return gen.next(v);});
            }, function(e) {
                step(function() {return gen.throw(e);});
            })
            step(function(){return gen.next(undefined);});
        }
    })
}
```

## 5. async/await测试题

### 5.1 测试一

```js
console.log(1);
async function asyncfn1(){
    console.log(2);
    await asyncfn2();
    console.log(3);
};
setTimeout(() => {
    console.log('setTimeout')
}, 0)

async function asyncfn2(){
    console.log(4)
};

asyncfn1();
console.log(5);
```

<details>
<summary>查看答案</summary>
    <pre>
    1
    2
    4
    5
    3
    setTimeout
    </pre>
</details>

### 5.2 测试二

```js
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')
```

<details>
<summary>查看答案</summary>
    <pre>
    script start
    async1 start
    async2
    promise1
    script end
    promise2
    async1 end
    setTimeout
    </pre>
</details>

<details>
<summary>详细解读</summary>
    <pre>
    1.执行同步代码
    <code>script start</code><br/>
    2.遇到setTimeout，推入宏任务队列<br/>
    3.执行async1()
    <code>async1 start</code><br/>
    4.遇到await 执行右侧表达式后让出线程，阻塞后面代码
    <code>async2</code><br/>
    5.执行promise中的同步代码
    <code>promise1</code><br/>
    6.将.then()推入微任务队列向下执行同步代码
    <code>script end</code><br/>
    7.同步代码执行完毕，执行所有微任务队列中的微任务
    <code>promise2</code><br/>
    8.微任务执行完毕，执行await后面的代码
    <code>async1 end</code><br/>
    9.带 async 关键字的函数，它使得你的函数的返回值必定是 promise 对象或undefined
    <code>async return</code><br/>
    10.带 async 关键字的函数，执行后会自动打印undefined
    <code>undefined</code><br/>
    11.开始下一轮evenloop，执行宏任务队列中的任务
    <code>setTimeout</code><br/>
    </pre>
</details>
