---
title: 【JS】ES6-生成器(function*)及其实现
date: 2019-10-2
sidebar: auto
categories: 
- 前端
tags: 
- JS
- ES6
---


## 1. 初识生成器Generator

闲来晚上睡不着，你去数三羊，`1,2,3`就真的三只羊，就没了。。。还是睡不着，于是继续产出（yield）羊：

```js
function* SheepGenerator(){
    let index = 1;
    while(true){
        yield index++;
    }
}

let countSheep = SheepGenerator();

countSheep.next().value; // 1
countSheep.next().value; // 2
countSheep.next().value; // 3
countSheep.next().value; // 4
。。。
```

这样，你能数到天荒地老。。。只要调用，就有产出。这就是一个最基本的生成器函数。

形式上，Generator 函数是一个普通函数，但是有两个特征：

+ `function`关键字与函数名之间有一个星号`*`；
+ 函数体内部使用`yield`表达式，定义不同的内部状态。

Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，即遍历器对象（Iterator Object）。必须调用遍历器对象的`next`方法，使得指针移向下一个状态。那么什么是状态呢？

## 2. 生成器的状态

```
countSheep.next() // {value: 6, done: false}
```

通过`next`方法调用生成器函数，发现返回一个对象，其中`value`表示当前产出的值，`done`表示是否还有下一个值，如果没有（`done: true`）(但是当不存在return语句时，就算没有下一个yield，最后一个yield也会为`done:false`)，继续调用返`{value: undefined, done: true}`，`value`值变为`undefined`，就算下次没有值了，你也可以继续调用，只不过返回的`value`是`undefined`

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world'; // { value: 'world', done: false }
  return 'ending'; // { value: 'ending', done: true }
}

let hw = helloWorldGenerator();

hw.next(); // { value: 'hello', done: false }

hw.next();// { value: 'world', done: false }

hw.next();// { value: 'ending', done: true }

hw.next();// { value: undefined, done: true }

hw.next();// { value: undefined, done: true }
```

## 3. yield表达式

**yield**将生成器分为一个一个节点，每次调用`.next`方法时，指针就会移到`yield`节点处，产出当前值，再次调用`.next`时，指针就会移到下一个`yield`节点处，以此类推。。。如果遇到`return`语句，标志`return`是最后一个`yield`节点，`return`后面的`yield`会被忽略：

```js
function* helloGenerator() {
  yield 'hello';
  return 'ending'; // yield节点截止标志
  yield 'World';  // 会被忽略
}

let hg = helloGenerator();
hg.next();//{ value: 'hello', done: false }
hg.next();// { value: 'ending', done: true }
hg.next();// { value: undefined, done: true }
```

Generator 函数可以不用`yield`表达式，这时就变成了一个单纯的暂缓执行函数：

```js
function* f() {
  console.log('执行了！')
}

var generator = f();
generator.next(); // '执行了'
```

函数`f`如果是普通函数，在为变量`generator`赋值时就会执行。但是，函数`f`是一个 Generator 函数，就变成只有调用`next`方法时，函数`f`才会执行。

`yield`表达式只能用在 Generator 函数里面，用在其他地方都会报错。

## 4. yield* 表达式

如果`yield`表达式后面跟的是一个遍历器对象，即在`yield`表达式后面加上星号，表明它返回的是一个遍历器对象。称为`yield*`表达式。

 **yield* 表达式**，就是在一个 Generator 函数里面执行另一个 Generator 函数：

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo(); // 内部执行Generator bar
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

任何数据结构只要有 Iterator 接口，就可以被`yield*`遍历：

```js
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```
## 5. 生成器（Generator）与迭代（遍历）器（Iterator）

原生具备 **Iterator 接口**的数据结构如下。

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对

一个对象如果要具备可被`for...of`循环调用的 Iterator 接口，就必须在`Symbol.iterator`的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。

**迭代器协议**：

当一个对象只有满足下述条件才会被认为是一个迭代器：

它实现了一个 `next()` 的方法并且拥有以下含义：

| 属性   | 值                                                           |
| :----- | :----------------------------------------------------------- |
| `next` | 返回一个对象的无参函数，被返回对象拥有两个属性：`done` (boolean)true:迭代器已经超过了可迭代次数。这种情况下,value的值可以被省略如果迭代器可以产生序列中的下一个值，则为 false。这等效于没有指定done这个属性。`value` - 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。next 方法必须要返回一一个对象，该对象有两个必要的属性： done和value，如果返回一个非对象值（比如false和undefined) 会展示一个 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) ("iterator.next() returned a non-object value") 的错误 |

**可迭代协议**：

普通对象变成可迭代对象， 一个对象必须实现 **@@iterator** 方法, 即这个对象（或者它原型链 [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) 上的某个对象）必须有一个名字是 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)`.iterator` 的属性:

`Symbol.iterator`属性对应一个函数，执行后返回当前对象的迭代器对象。

| 属性                | 值                                                 |
| :------------------ | :------------------------------------------------- |
| `[Symbol.iterator]` | 返回一个对象的无参函数，被返回对象符合迭代器协议。 |

自定义迭代器：

```js
let myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable]; // [1, 2, 3]
```

对数组和 Set 结构进行解构赋值时，会默认调用`Symbol.iterator`方法：

```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

扩展运算符（...）也会调用默认的 Iterator 接口：

```js
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

`[生成器对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 既是迭代器也是可迭代对象：

```js
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

let iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }

[...iterator]; // [1, 2, 3, 4, 5]
```

一旦`next`方法的返回对象的`done`属性为`true`，`for...of`循环就会中止，且不包含该返回对象，即return语句的值不会被for..of 遍历,也不会被解构出来：

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6; // return不会被for..of 遍历,也不会被解构出来
}
[...foo()]; // [1, 2, 3, 4, 5]
// foo()
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

// 注意f
let f = foo()
for (let v of f) {
  console.log(v);
}
```

实现斐波那契数列：

```js
function* fibonacci(){
    let [prev, curr] = [0, 1];
    while(true){
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}
for(let n of fibonacci()) {
    if(n > 100) break;
    console.log(n)
}
```

> [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)

## 6. Generator.prototype.next

+ 语法：`gen.next(value)`

**next()** 方法返回一个包含属性 `done` 和 `value` 的对象。该方法也可以通过接受一个参数用以向生成器传值。

```js
function* gen() {
  while(true) {
    var value = yield null;
    console.log(value);
  }
}

let g = gen();
g.next(1); 
// "{ value: null, done: false }"
g.next(2); 
// 2
// "{ value: null, done: false }"
```

注意，由于**`next`方法的参数表示上一个`yield`表达式的返回值**，所以在第一次使用`next`方法时，传递参数是无效的。

## 7. Generator.protytype.return

+ 语法：`gen.return(value)`

**return()** 方法返回给定的值(value)并结束生成器。如果`return`方法调用时，不提供参数，则返回值的`value`属性为`undefined`。

```js
function* gen() { 
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next();        // { value: 1, done: false }
g.return("foo"); // { value: "foo", done: true }
g.next();		// { value: undefined, done: true }
```

如果 Generator 函数内部有`try...finally`代码块，且正在执行`try`代码块，那么`return`方法会导致立刻进入`finally`代码块，执行完以后，整个函数才会结束。

```js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

## 8. Generator.prototype.throw

+ 语法：`gen.throw(exception)`

**throw()** 方法用来向生成器抛出异常，并恢复生成器的执行，返回带有 `done` 及 `value` 两个属性的对象。

```js
function* gen() {
  while(true) {
    try {
       yield 42;
    } catch(e) {
      console.log(e);
    }
  }
}

let g = gen();
g.next(); // { value: 42, done: false }
g.throw(new Error("Something went wrong")); //"Something went wrong"
```

## 9.理解 next()、throw()、return() 

`next()`、`throw()`、`return()`这三个方法本质上是同一件事，都是让 Generator 函数恢复执行，并且使用不同的语句替换`yield`表达式

`next()`是将`yield`表达式替换成一个值：

```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

`throw()`是将`yield`表达式替换成一个`throw`语句：

```js
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

`return()`是将`yield`表达式替换成一个`return`语句：

```js
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```
## 10. 手写generator函数

下面实现这样一个函数：

1.`.next`调用：

其实这就是一个迭代器，实现了[**迭代器协议**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)：

```js
let g = generator(1,2,3);
g.next(); // {value: 1, done: false}
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: false}
g.next(); // {value: undefined, done: true}
```

使用单例模式及闭包（简单理解，就是函数内部嵌套的函数引用了内部变量）实现：

```js
function generator(...rest) {
    let index = -1;  // 内部变量
    return {
        next() { 	// 内部函数
            index++; // 形成闭包
            return {value: rest[index], done: !rest[index]}
        }
    }
}

// 测试
let g = generator(1,2);
g.next(); // {value: 1, done: false}
g.next(); // {value: 2, done: false}
g.next(); // {value: undefined, done: true}
```

2.`for...of`遍历：

 `for...of`遍历会默认调用[Symbol.iterator]()方法

其实这就是一个可迭代对象，实现了**可迭代**协议：

```js
for(let i of g) {
    console.log(i);
}; // 依次输出 1 2 3
```

上面虽然实现了`.next`操作，但是返回的是一个普通对象而不是一个可迭代对象，是不能使用`for...of`遍历的，下面将这个普通对象变为可迭代对象：

```js
function generator(...rest) {
    let index = -1;
    return {
        next() { // 产生迭代器
            index++;
            return {value: rest[index], done: !rest[index]}
        }, 
        [Symbol.iterator](){
            return this; // 返回当前迭代器
        }
    }
}

let g = generator(1,2,3);
// for..of
for(let i of g){
    console.log(i); // 输出 1 2 3
}
// 解构
[...g]; // [1,2,3]
```

因为Generator既是迭代器（`.next()`）又是可迭代对象（`[Symbol.iterator]`），所以我们的`generator`也要实现[迭代器协议和可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)。

3.`.return`结束：

```js
let f = generator([1,2,3]);
g.next(); // {value: 1, done: false}
g.return(22); // {value: 22, done: true}
g.next(); // {value: undefined, done: true}
```

注意`return`是关键字，最好使用**ES6属性名表达式`['return'](){}`定义方法名**：

```js
function generator(...rest) {
    let index = -1;
    let isReturned = false; // 判断是否调用了return
    return {
        next() {
            index++;
            if (!isReturned) {
                return {value: rest[index], done: !rest[index]}
            }
            return {value: undefined, done: true}
        },
        [Symbol.iterator]() {
            return this;
        },
        
        ['return'](value) { // ES6属性名表达式
            isReturned = true;
            return {value: value, done: true};
        }
    }
}

// 测试：
let a = generator(1,2,3)
{next: ƒ, return: ƒ, Symbol(Symbol.iterator): ƒ}
a.next()
// {value: 1, done: false}
a.return(111)
// {value: 111, done: true}
a.next()
// {value: undefined, done: true}
a.next()
// {value: undefined, done: true}
```



