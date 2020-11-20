---
title: 【JS】ES6-对象方法及函数
date: 2019-10-7
sidebar: auto
categories: 
- 前端
tags: 
- JS
- ES6
---

## 1. 对象表示法

### 1.1 属性简洁表示法

在大括号`{变量或函数}`里面，直接写入变量和函数，作为对象的属性和方法

```js
// ES6 属性表示法：
const name = 'Jax';
const age = 15;
const p2= {
    name,  // 属性简写
    age,
    sayHi(){ // 方法简写
        console.log('hello ' + this.name);
    }
}
```

### 1.2 属性名表达式

把表达式放在方括号内`[表达式]`，作为对象属性名：

```js
//restful Api
const method = ['get', 'post', 'put', 'delete'];
const getData = {
    [method[0]]() {
        console.log('GET');
    },
    [method[1]]() {
        console.log('POST');
    },
    [method[2]]() {
        console.log('PUT');
    },
    [method[3]]() {
        console.log('DELETE');
    },
    ['hi']: 'HeLLO';
}
```

+ 注意，属性名表达式与简洁表示法，不能同时使用，会报错。

+ 注意，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串`[object Object]`

```js
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
```

所以，属性名表达式的值，必须为基本类型，最好为字符串。

## 2. 对象的属性

### 2.1  函数的`name`属性

函数的`name`属性，返回函数名:

```js
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"
```

匿名函数：

```js
(function(){console.log(11)}).name; // ''空字符串
let a = (function(){console.log(11)})();
a.name; // 'a'

(new Function()).name; // "anonymous"
```

`bind`函数：

```js
let test = function(){};
test.bind().name; // "bound test"
```

`Symbol`属性名的函数：

如果对象的方法是一个 Symbol 值，那么`name`属性返回的是这个 Symbol 值的描述

```js
cost key = Symbol('key');
let gen = {
    [Symbol.iterator](){
        return this;
    },
    [key](){};
};

gen[Symbol.iterator].name; // "[Symbol.iterator]"
gen[key].name; // "[key]"
```

### 2.2 属性的可枚举性和遍历

```js
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

描述对象的`enumerable`属性，称为“可枚举性”，如果该属性为`false`，就表示某些操作会忽略当前属性。

目前，有四个操作会忽略`enumerable`为`false`的属性。

- `for...in`循环：只遍历**对象自身**的和**继承的**可枚举的属性。（包含继承）
- `Object.keys()`：返回**对象自身**的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化**对象自身**的可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝**对象自身**的可枚举的属性。

比如，对象原型的`toString`方法，以及数组的`length`属性，就通过“可枚举性”，从而避免被`for...in`遍历到。

```js
Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable
// false

Object.getOwnPropertyDescriptor([], 'length').enumerable
// false
```

另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。

```js
Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable
// false
```

大多数时候，我们只关心对象自身的属性。所以，尽量不要用`for...in`循环，而用`Object.keys()`代替。

ES6 一共有 5 种方法可以遍历对象的属性。

**（1）for...in**

`for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

**（2）Object.keys(obj)**

`Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

**（3）Object.getOwnPropertyNames(obj)**

`Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

**（4）Object.getOwnPropertySymbols(obj)**

`Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名。

**（5）Reflect.ownKeys(obj)**

`Reflect.ownKeys`返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有**数值**键，按照数值升序排列。
- 其次遍历所有**字符串**键，按照加入时间升序排列。
- 最后遍历所有 **Symbol** 键，按照加入时间升序排列。

```javascript
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
```

上面代码中，`Reflect.ownKeys`方法返回一个数组，包含了参数对象的所有属性。这个数组的属性次序是这样的，首先是数值属性`2`和`10`，其次是字符串属性`b`和`a`，最后是 Symbol 属性。

## 3. super关键字

+ `this`关键字总是指向函数所在的当前对象

+ `super`指向当前对象的原型对象，**只能用在对象的方法之中**

`Object.setPrototypeOf()`，为现有对象**设置原型**，返回一个新对象 
接收两个参数：第一个是现有对象，第二是原型对象。 

```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};
// 指定原型之前
obj.__proto__ === proto;//false
obj.find() // undefined
// 指定原型之后
Object.setPrototypeOf(obj, proto);
obj.__proto__ === proto ;//true
obj.find() // "hello"
```

JavaScript 引擎内部，`super.foo`等同于`Object.getPrototypeOf(this).foo`（属性）或`Object.getPrototypeOf(this).foo.call(this)`（方法）。

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);// this会动态绑定
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo(); // proto.foo
  }
}

Object.setPrototypeOf(obj, proto);

obj.foo() // "world"
```

上述代码中，`super.foo`指向原型对象`proto`的`foo`方法，但是绑定的`this`却还是当前对象`obj`，因此输出的就是`world`。

`super`在面向对象编程一节会在专门学习。

## 4. 扩展运算符

对象的扩展运算符（`...`）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

```js
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }

let foo = { ...['a', 'b', 'c'] };
foo
// {0: "a", 1: "b", 2: "c"}

{...'hello'}
// {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
```

完整克隆一个对象，并拷贝**对象原型**的属性：

扩展运算符的解构赋值，不能复制继承自原型对象的属性

```js
let obj = {
    a:1,
    b:2,
    c: [1,2]
};
let proto = {
    d:3,
    e: 4
}
// 指定原型
Object.setPrototypeOf(obj, proto);

// 写法一：浅拷贝，没有继承原型
obj1 = {...obj};
obj1.d; //undefined

// 写法二: 浅拷贝，继承原型
const clone1 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);
clone1.d; // 3
// 写法三： 浅拷贝，继承原型
const clone2 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
clone2.d; // 3
```

合并对象：

```js
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```

## 5. 函数

### 5.1 默认参数

```js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
```

注意，参数变量是默认声明的，所以不能用`let`或`const`再次声明。

```js
function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
  console.log(method);
}

fetch('http://example.com')
// "GET"
```

### 5.2  函数的length属性

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。

```js
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了。rest 参数也不会计入`length`属性

```js
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
(function(...args) {}).length // 0
```

### 5.3 rest参数

rest 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象。rest 参数之后不能再有其他参数

````js
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
sortNumbers([1,2,3,4])
````

ES6规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

### 5.4 箭头函数

ES6 允许使用“箭头”（`=>`）定义函数。

```js
// 箭头函数写法
[1,2,3].map(x => x * x);
```

箭头函数有几个使用注意点:

+ 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。

+ 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误。

+ 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

+ 不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数。

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```

除了`this`，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：`arguments`、`super`、`new.target`。

```js
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]
```

上面代码中，箭头函数内部的变量`arguments`，其实是函数`foo`的`arguments`变量。

另外，由于箭头函数没有自己的`this`，所以当然也就不能用`call()`、`apply()`、`bind()`这些方法去改变`this`的指向。

### 5.5. 函数的尾调用及尾递归

**尾调用**（Tail Call）：指某个函数截止执行的最后一步是`return`另一个函数，且没有其他操作。

```js
function f(x){
    // 尾递归即在程序尾部调用自身，注意这里没有其他的运算
  return g(x);
}

// 以下不属于尾调用
// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
```

函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。

如果在函数`A`的内部调用函数`B`，那么在`A`的调用帧上方，还会形成一个`B`的调用帧。等到`B`运行结束，将结果返回到`A`，`B`的调用帧才会消失。如果函数`B`内部还调用函数`C`，那就还有一个`C`的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）。

**尾调用优化**（Tail call optimization）：即只保留内层函数的调用帧

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

```js
function addOne(a){
  var one = 1;
  function inner(b){
    return b + one;
  }
  return inner(a);
}
```

上面的函数不会进行尾调用优化，因为内层函数`inner`用到了外层函数`addOne`的内部变量`one`。

ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。

这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。

- `func.arguments`：返回调用时函数的参数。
- `func.caller`：返回调用当前函数的那个函数。

尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以**尾调用模式仅在严格模式下生效**。

**尾递归**：函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

```js
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```

递归本质上是一种循环操作。

```js
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000) 
// Uncaught RangeError: Maximum call stack size exceeded(…)
```

上面代码中，`sum`是一个递归函数，参数`x`是需要累加的值，参数`y`控制递归次数。一旦指定`sum`递归 100000 次，就会报错，提示超出调用栈的最大次数。

蹦床函数（trampoline）可以将递归执行转为循环执行。

```js
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
```

```js
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
```

现在，使用蹦床函数执行`sum`，就不会发生调用栈溢出:

```js
trampoline(sum(1, 100000))
// 100001
```

蹦床函数并不是真正的**尾递归优化**（Tail Call Optimisation），下面的实现才是:

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];
// 闭包
  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}
```

使用上面的函数包装一下：

```js

// sum使用尾递归优化
var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

// 没有造成栈溢出
sum(1, 100000)
// 100001
```

上面代码，很巧妙地**将“递归”改成了“循环”**，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。这就是尾递归优化。

## 7. Proxy对象

## 8. Reflect对象
