---
title: 【JS】ES6-面向对象编程
date: 2019-10-26
sidebar: auto
categories: 
- 前端
tags: 
- JS
- ES6
---

## 1. class语法

```js
// es5面向对象
function Person(name, age){ // 构造方法
    // 实例属性
    this.name = name;
    this.age = age;
}

// 实例方法
Person.prototype.sayHi = function() {
    console.log('hello')
}
Person.prototype.toString = function() {
    console.log(this.name + ',' + this.age)
}
// 静态方法
Person.isPerson = function(obj){
    return !!obj.name && !!obj.age;
}
// 静态属性
Person.type = 'Animal';

// 使用
var p = new Person('张三', 12);
p.sayHi(); // 'hello'
p.toString; // 张三, 12

Person.type; // Animal
Person.isPerson(p); // true
```

这是ES5之前的面向对象写法，那么使用ES6的`class`语法，又如何改进？

### 1.1 构造方法constructor

构造方法(constructor)，即一被实例化就调用的方法：

`constructor`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。

```js
class Person {
    // 构造方法
    constructor(name, age) {
        this.name = name;
        this.age = age;
        console.log('我被实例化了');
    }
}

let p1 = new Person('张三', 12); // 我被实例化了
new Person() instanceof Person; // true 
```

class类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。

`constructor`方法默认返回当前实例对象（即`this`），完全可以指定返回另外一个对象(**慎用**)。

```js
class Person {
    // 构造方法
    constructor(name, age) {
        this.name = name;
        this.age = age;
        // 构造方法默认返回this，可以显示返回其他对象
        return Object.create(null);
    }
}
new Person() instanceof Person; // false 指向另一个对象了
```

`Object.create(null);`生成一个完全为空属性的对象（No properties），没有任何继承（原型`__proto__`）。

java中可以定义多个不同参数的构造方法，但是js里面一个class只能有一个`constructor`,或者默认不写。

### 1.2  实例属性、方法

实例属性、方法，顾名思义，必须`new`实例化之后才能调用：

与 ES5 一样，**实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）。**

```js
class Person {
    // 实例属性
	gender = 'Male';
    // 构造方法
    constructor(name, age) {
        // 实例属性
        this.name = name;
        this.age = age;
    }
    // 实例方法
	toString() {
        console.log(this.name + ',' + this.age)
    }
	getGender() {
        return this.gender
    }
}
// 调用实例方法
new Person().getGender(); // "Male"
```

### 1.3 静态属性、方法

静态属性、方法，不需要new`实例化就能调用。

在实例属性或方法的前面，加上`static`关键字：

```js 
// 使用static关键字
class Person {
    static type = 'Animal';
	static isPerson(obj) {
    	return !!obj.name && !!obj.age;
	}
};
// 没有static之前的写法和ES5一样
Person.type = 'Animal';
```

### 1.4 私有属性、方法

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。

typescript中可以使用`private`定义私有属性，但ES6目前不支持。在模块化开发中，可以将私有属性和方法移到class外面，然后不向外暴露：

`person.js`中

```js
// 私有属性
const gender = ['Male', 'Female'];
class Person {
   gender = gender[0];
   sayHi(){
       sayHello();
   } 
}
// 私有方法
function sayHello(name) {
    console.log('Hello');
}
export Person;
```

** ES6之后有一个[提案](https://github.com/tc39/proposal-private-methods)，提议在实例属性或方法前面加`#`表示私有属性或方法：

```js
class Person {
    // 私有属性
   #name = '隔壁老王';
    sayHi(){
       console.log(this.#name);
   };
}
// 访问私有属性
new Person().sayHi(); // 隔壁老王
```

### 1.5 getter和setter存取器

getter和setter存取器，相当于一个拦截器，对某个属性设置存值函数和取值函数，拦截该属性的存取行为：

```js
class Person {
    // 构造方法
    constructor(name, age) {
        // 实例属性
        this.name = name;
        this.age = age;
    }
    // getter
    get gender(){
        console.log('getter');
        return 'Male';
    }
    // setter
    set gender(gender){
        console.log('setter');
    }
}

let p = new Person('Tom', 10);
p.gender; // getter
p.gender = 'Female'; // setter
```

`Vuejs`的双向绑定原理，就是通过`Object.definePorperty()`来监听`get`和`set`事件：

```js
function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  // 监听obj对象每个属性
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

// 监听对象的getter和setter
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
    }
  })
}

// 使用
let data = {a: 1};
// 监听getter和setter
observe(data);
// 操作obj对象
obj.a; // get value
obj.a = 2; // change value
```

ES6的`Proxy`也可以实现对对象属性存取的劫持，`Vuejs 3.x`的双向绑定原理就是基于`Proxy`的：

```js
const obj = new Proxy({}, {
  get(target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

// 使用
obj.a = 1; // setting a!
obj.a; // getting a!
```



## 2. class继承

### 2.1 extends关键字

Class 可以通过`extends`关键字实现继承：

```js
class Person {}
// 使用extends关键字继承
class Student extends Person {}
```

在`extends`继承之后，子类产生了新的关键字`super`

### 2.2 super关键字

+ 1.`super`作为函数调用时(`super(x,y)`)，代表父类的构造函数,只能用在子类的构造方法中，不能在普通方法中调用。

ES6 要求，子类的构造函数必须执行一次`super`函数。

```js
class A {
    constructor(x,y) {
        this.x = x;
        this.y = y;
  }
}

class B extends A {
    // 子类的构造函数必须执行一次`super`函数。
  constructor(x,y,z) { 
      // super代表A的constructor
    super(x,y);
      // this要在super之后
    this.z = z;
  }
}
```

注意，`super()`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super()`内部的`this`指的是`B`的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

+ 2.`super`作为对象(`super.xxx`)时，在**非静态方法**中，指向父类的**原型对象**，即只能调用父类的实例属性或方法；在**静态方法**中，指向**父类**, 即只能调用父类的静态属性或方法。

```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```

上面代码中，子类`B`当中的`super.p()`，就是将`super`当作一个对象使用。这时，`super`在普通方法之中，指向`A.prototype`，所以`super.p()`就相当于`A.prototype.p()`。

如果`super`作为对象，用在**静态方法**之中，这时`super`将指向**父类**(调用的是父类的静态属性)，而不是父类的原型对象（调用的是父类的实例属性）。

```js
class Parent {
    // 静态方法
  static myMethod(msg) {
    console.log('static', msg);
  }

    // 非静态方法
  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg); // static
  }

  myMethod(msg) {
    super.myMethod(msg); // instance
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

### 2.3 this关键字

+ 静态方法中的`this`只能调用静态方法（即this指向类）

+ 非静态方法中的`this`只能调用实例方法(即this指向类的原型)

```js
class Foo {
  constructor(){
    console.log('constructor')
	this.baz();
  }
  bar() {
    console.log('instance bar')
    this.baz();
  }
   static bar() {
    console.log('static bar')
    this.baz();
  }
    // 静态baz方法
  static baz() {
    console.log('static baz');
  }
    // 实例baz方法
  baz() {
    console.log('instance baz');
  }
}


Foo.bar(); 
// static bar  
// static baz

new Foo().bar(); 
// constructor
// instance baz
// instance bar  
// instance baz
```

### 2.4 super与this

1.在子类普通方法中通过`super`调用父类的方法时，父类方法内部的`this`指向当前的子类实例。

```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    // super中的this指向当前实例对象
    super.print();
  }
}

let b = new B();
b.m() // 2
```

2.在子类的静态方法中通过`super`调用父类的方法时，父类方法内部的`this`指向当前的子类，而不是子类的实例。

```js
class A {
  constructor() {
    this.x = 'A instance value';
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 'B instance value';
  }
  static m() {
    super.print();
  }
}

B.x = 'B static value'; // 静态属性

B.m() // B static value
```

总而言之，不论是通过this（调用当前类）还是super（调用父类），静态方法中只能调用静态方法或属性，非静态方法（构造方法和普通方法）中只能调用实例属性或方法。

另外，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

### 2.5 继承的实质

`Object.getPrototypeOf()`方法可以用来从子类上获取父类，因此，可以使用这个方法判断，一个类是否继承了另一个类。 

```js
class A {};
class B extends A {};

Object.getPrototypeOf(B) === A; // true
B instanceof A; // false  instanceof 判断是否是A的实例
```

每一个对象都有`__proto__`属性（用`Object.create(null)`方法创建的对象除外），每一个函数还有`prototype`属性。用`class`创建的类和函数一样，都有`__proto__`和`prototype`这两个属性，即原型链对象，ES6的`extends`继承的实现，其实就是通过原型链来完成的：

```js
// 模式实现继承：
class A {}
class B {}
Object.setPrototypeOf(B.prototype, A.prototype);  // B 的实例继承 A 的实例
Object.setPrototypeOf(B, A);  // B 继承 A 的静态属性
const b = new B();
Object.setPrototypeOf = function (obj, proto) { // Object.setPrototypeOf 方法的模拟实现
  obj.__proto__ = proto;
  return obj;
}
```

于是,可以得出：

```js
// 子类的 __proto__ 属性，表示构造函数的继承，总是指向父类
B.__proto__ === A // true

// 子类 prototype 属性的 __proto__ 属性，表示方法的继承，总是指向父类的 prototype 属性
B.prototype.__proto__ === A.prototype // true
```

这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__ 属性）是父类（A）；作为一个构造函数，子类（B）的原型对象（prototype 属性）是父类的原型对象（prototype 属性）的实例。

`class B extends A { }`只要 A 是一个有 `prototype` 属性的函数，就能被 B 继承。由于函数都有 `prototype` 属性（除了 `Function.prototype` 函数），因此 A 可以是任意函数。

特殊情况一：子类继承 Object 类（子类其实就是构造函数 Object 的复制，子类的实例就是 Object 的实例）

```js

class A extends Object {}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

特殊情况二：不存在任何继承

```js
class A {}
A.__proto__ === Function.prototype 
// true，A 作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承 Function.prototype

A.prototype.__proto__ === Object.prototype // true，A 调用后返回一个空对象（即 Object 实例），所以 A.prototype.__proto__ 指向构造函数（Object）的 prototype 属性
```

 特殊情况三：子类继承 null

```js
class A extends null {}

A.__proto__ === Function.prototype // true
// A 也是一个普通函数，所以直接继承 Function.prototype

A.prototype.__proto__ === undefined // true
// A 调用后返回的对象不继承任何方法，所以它的prototype.__proto__ 指向 undefined

// 实质上等同于
class C extends null {  
  constructor() { return Object.create(null); }
}
```

### 2.6 原生对象的继承

注意，**原生构造函数是在ES5以前是无法继承的**，ECMAScript 的原生构造函数大致：`Boolean()`、`Number()`、`String()`、`Array()`、`Date()`、 `Function()`、`RegExp()`、`Error()`、`Object()`。

**ES6 允许继承原生构造函数定义子类**，比如：继承 Array：

```js
// 有版本记录的数组
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

x.push(1); // x = [1, history: Array(1)]
x.push(11);// x = [1, 11, history: Array(1)]
x.commit(); // x =  [1, 11, history: Array(2)]
```

## 3. 实战：鼠标移动产生彩色小球

<iframe height="265" style="width: 100%;" scrolling="no" title="HTML5-canvas-ball" src="https://codepen.io/keekuun/embed/BaaRRNg?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/BaaRRNg'>HTML5-canvas-ball</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

