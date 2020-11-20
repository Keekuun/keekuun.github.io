---
title: 【JS】一箭干掉this-bind-call-apply
date: 2019-7-1
sidebar: auto
categories: 
- 前端
tags: 
- JS
---

> javascript中的this，真的“人如其名”，如果你不把它当回事儿，有时真的能把人“累死”！

## 一、认识this

>python中的this
```python
> import this

The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!

```
咳咳，言归正传。。。回到javascript

### 浏览器环境下的全局this
```bash
> console.log(this)
Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
> Object.prototype.toString.call(this)
"[object Window]"
```
这里this指Window对象。
### Node环境下的全局this
```bash                                                                     
> console.log(this)                                                                     
Object [global] {                                                                       
  global: [Circular],                                                                   
  clearInterval: [Function: clearInterval],                                             
  clearTimeout: [Function: clearTimeout],                                               
  setInterval: [Function: setInterval],                                                 
  setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },   
  queueMicrotask: [Function: queueMicrotask],                                           
  clearImmediate: [Function: clearImmediate],                                           
  setImmediate: [Function: setImmediate] {                                              
    [Symbol(util.promisify.custom)]: [Function]                                         
  }                                                                                     
}   

> Object.prototype.toString.call(this)                                                  
'[object global]'
```
这里this指global对象。

其实都是指代全局对象，只不过运行环境不一样，全局对象名称不同。

### js函数中的this
#### 普通函数中的this
+ 1.一般函数
```js
function log() {
    console.log(this); // this指向顶层(上层)对象，在浏览器中是window对象，在node中是global对象
    return function() {
      console.log(this); // this指向上层对象，这里指log函数    }
    }
}
log();

```

+ 2.js对象中的函数
```js
var person = {
    name: '德玛西亚之力', 
    age: 24, 
    gender: '男', 
    nickName: 'gay伦', 
    say: function(){
        console.log(this);
        console.log('人在塔在--by ' + this.nickName)
    }
};
person.nickName; // gay伦

person.say();
// {name: "德玛西亚之力", age: 24, gender: "男", nickName: "gay伦", say: ƒ}
// 人在塔在--by gay伦
```
这里this指代person对象。

+ 3.使用原型链的函数
```js
Array.prototype.log = function() {
    console.log(this) // 这里this指向Array对象，而不是Array.prototype
};

[1,2,3].log(); // [1,2,3]
```
> 这里给Array对象添加了log方法，任何Array对象都可以调用[].log()方法。

#### 构造函数中的this 
```js
function Person(obj){
    this.name = obj.name;
    this.age = obj.age;
    this.height = obj.height;
    console.log(this)
}

var dema = new Person({name:'Dema', age: 24, height: 180});
console.log(dema)
// Person { name: 'Dema', age: 24, height: 180 }
// Person { name: 'Dema', age: 24, height: 180 }
```
#### ES6箭头函数中没有this
```js
var name = "Bob";
var obj = {
    name: "Dancy",
    fn: () => { 
         console.log(this); //顶层对象，在浏览器中是window对象
    }
};
 obj.fn(); 
```
## 二、理解this bind call apply

> 案例：求数组[6,2,3,1,4,5]的最大值

```js
// 普通
Math.max(6,2,3,1,4,5);
// bind
Math.max.bind(null,6,2,3,1,4,5)();
// call 
Math.max.call(null,6,2,3,1,4,5);
// bind
Math.max.apply(null,[6,2,3,1,4,5]);
//ES6
Math.max(...[6,2,3,1,4,5]);
Math.max.bind(null,...[6,2,3,1,4,5])();
Math.max.call(null,...[6,2,3,1,4,5]);
```
通过上面的例子，大概对this bind call apply有了一定的认识。

1. 基本概念和作用
    三个方法均继承自Function.prototype,所有的函数都可以调用这三个方法。
    + bind: “绑定”。将函数内部的this绑定新的指向，返回一个`新函数`。不会立即执行，需再次调用，不兼容低版本IE（<IE9）   
    + call和apply: 指定函数内部的this指向，然后在所指定的作用域中，调用该函数，会立即执行该函数。

2. this bind call apply三者对比

|类别|参数内容|参数数量|返回值|理解|
|---|---|---|---|---|
|.bind|(this新指向，arg1,arg2...)|多个参数|返回新函数|绑定新this目标，不立即执行，必须再次调用（绑了要解绑才能玩）。|
|.call|(this新指向，arg1,arg2...)|多个参数|返回原函数的返回值|将this call新目标，“随叫随到”立即执行。|
|.apply|(this新指向，[arg1,arg2...])|两个参数|返回原函数的返回值|apply使用新的this，既然使用了，就立即执行了。|

> 注意 bind和call第一个参数为新this指向，后面分别为参数值1，参数值2...
> apply第一个参数为新this指向，第二个参数为一个Array。

> 优秀博客：[JS中的call、apply、bind方法详解](https://www.cnblogs.com/moqiutao/p/7371988.html)

