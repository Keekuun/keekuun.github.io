# JS 实现继承的几种方式

## 1.原型链继承

```js
function Parent() {
    this.name = 'parent';
    this.money = [1, 2, 5, 10]
}

function Child() {
    this.name = 'child'
}

// 原型链继承 关键代码
Child.prototype = new Parent()

const child1 = new Child();
const child2 = new Child();

// 改变child的data
child1.money.push(50);
child2.money.push(100);

console.log(child1.money)
console.log(child2.money)
```

+ 缺点：多个实例使用的是同一个原型对象

下面原型属性共享问题：

## 2.构造函数继承（借助call）

```js
function Parent() {
    this.name = 'parent';
    this.money = [1, 2, 5, 10];
}

Parent.prototype.getName = function () {
    return this.name
}

function Child() {
    // 构造函数继承关键代码
    Parent.call(this);
    this.name = 'child';
}

let child = new Child();
console.log(child);  // 没问题
console.log(child.getName());  // 会报错
```

+ 优点：解决了原型链继承多个实例使用的是同一个原型对象的问题
+ 缺点：父类原型对象中一旦存在父类之前自己定义的方法，那么子类将无法继承这些方法

## 组合继承（前两种组合）

```js
function Parent() {
    this.name = 'parent';
    this.money = [1, 2, 5, 10];
}

Parent.prototype.getName = function () {
    return this.name
}

function Child() {
    // 构造函数继承关键代码
    Parent.call(this);  // Parent执行一次
    this.name = 'child';
}

// 原型链继承 关键代码
Child.prototype = new Parent(); // Parent再次执行一次
// 手动挂上构造器，指向自己的构造函数
Child.prototype.constructor = Child;
```

+ 优点：解决了原型链继承和构造函数继承的缺点
+ 缺点：父类函数执行了两次，增加额外的开销

之前都是围绕着构造函数的方式来实现继承，现在我们先看看原型式继承：

## 4.原型式继承

```js
const parent = {
    name: 'parent',
    money: [1, 2, 5, 10],
    getName: function () {
        return this.name
    }
}

// 原型式继承关键代码
const child = Object.create(parent)


let person1 = Object.create(parent);
person1.name = "tom";
person1.money.push(20);

let person2 = Object.create(parent);
person2.name = "jerry";
person2.money.push(50);

console.log(person1.name); // tom
console.log(person1.name === person1.getName()); // true
console.log(person2.name); // jerry

// 缺点
console.log(person1.money); // [1,2,5,10, 20, 50]
console.log(person2.money); // [1,2,5,10, 20, 50]
```

通过 `Object.create` 这个方法可以实现普通对象的继承，不仅仅能继承属性，同样也可以继承 `getName` 的方法

+ 缺点：多个实例的引用类型属性指向相同的内存，存在篡改的可能

## 5.寄生式继承

```js
const parent = {
    name: 'parent',
    money: [1, 2, 5, 10],
    getName: function () {
        return this.name
    }
}

function clone(target) {
    let obj = Object.create(target);
    obj.getMoney = function () {
        return this.money
    };

    return obj;
}

let person = clone(parent);

console.log(person.getName()); // 'parent'
console.log(person.getMoney()); // [1,2,5,10]
```

我们可以看到 person 是通过寄生式继承生成的实例，它不仅仅有 getName 的方法，而且可以看到它最后也拥有了 getMoney 的方法.

第三种组合继承方式中提到了一些弊端，即两次调用父类的构造函数造成浪费，下面要介绍的寄生组合继承就可以解决这个问题:

## 6.寄生组合式继承

```js
// 寄生组合式继承 关键代码
function clone(parent, child) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function Parent() {
    this.name = 'parent';
    this.money = [1, 2, 5, 10];
}

Parent.prototype.getName = function () {
    return this.name
}

function Child() {
    // 构造函数继承 关键代码
    Parent.call(this);
    this.name = 'child';
}

clone(Parent, Child)

// Child 原型上新增方法
Child.prototype.getMoney = function () {
    return this.money;
}

let person = new Child();
console.log(person);
console.log(person.getName()); // child
console.log(person.getMoney()); // [1,2,5,10]

```

这种寄生组合式继承方式，基本可以解决前几种继承方式的缺点，较好地实现了继承想要的结果，同时也减少了构造次数，减少了性能的开销

整体看下来，这六种继承方式中，寄生组合式继承是这六种里面最优的继承方式。

## 7.ES6继承

```js
class Parent {
    constructor(name) {
        this.name = name
        this.money = [1, 2, 3, 4]
    }

    getName = function () {
        return this.name
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name)
        this.age = age
    }

    getAge = function () {
        return this.age
    }

    getMony = function () {
        return this.money
    }
}

const person = new Child('jeek', 18);
person.getAge(); // 18
person.getName(); // jeek
person.getMony(); //  [1,2,3,4]
```

因为浏览器的兼容性问题，如果遇到不支持 ES6 的浏览器，那么就得利用 babel 这个编译工具，将 ES6 的代码编译成 ES5，让一些不支持新语法的浏览器也能运行。

那么最后 extends 编译成了什么样子呢？我们看一下转译之后的代码片段:

```js
function _possibleConstructorReturn(self, call) {
    // ...
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits(subClass, superClass) {
    // 这里可以看到
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
```

从上面编译完成的源码中可以看到，它采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式。

![](https://s0.lgstatic.com/i/image/M00/8D/4A/Ciqc1F_9SVuAfHXWAAEfwyAfiC0647.png)

通过 Object.create 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 extends 的语法糖和寄生组合继承的方式基本类似。

# JS拷贝-浅拷贝

## 1.object.assign-浅拷贝

```js
// Object.assign(target, ...sources)

let target = {};

let source = {a: {b: 1}};

Object.assign(target, source);

console.log(target); // { a: { b: 1 } };

```

## 2.扩展运算符-浅拷贝

```js
/* 对象的拷贝 */
let obj = {a: 1, b: {c: 1}}
let obj2 = {...obj}
obj.a = 2
console.log(obj)  //{a:2,b:{c:1}} console.log(obj2); //{a:1,b:{c:1}}
obj.b.c = 2
console.log(obj)  //{a:2,b:{c:2}} console.log(obj2); //{a:1,b:{c:2}}
/* 数组的拷贝 */
let arr = [1, 2, 3];
let newArr = [...arr]; //跟arr.slice()是一样的效果

```

## 3.concat拷贝数组-浅拷贝

```js
let arr = [1, 2, 3];

let newArr = arr.concat();

newArr[1] = 100;

console.log(arr);  // [ 1, 2, 3 ]

console.log(newArr); // [ 1, 100, 3 ]

```

## 4.slice拷贝数组-浅拷贝

```js
let arr = [1, 2, {val: 4}];

let newArr = arr.slice();

newArr[2].val = 1000;

console.log(arr);  //[ 1, 2, { val: 1000 } ]

```

## 5.手写浅拷贝

```js
function shallowCopy(target) {
    if (typeof target === 'object' && target !== null) {
        const cloneObj = Array.isArray(target) ? [] : {};

        for (let prop of target) {
            if (target.hasOwnProperty(prop)) {
                clone[prop] = target[prop]
            }
        }

        return cloneObj
    } else {
        return target
    }
}
```

# JS拷贝-深拷贝

## 1.JSON.stringify

```js
const deepClone = obj => JSON.parse(JSON.stringify(obj)) 
```

问题：

+ 拷贝的对象的值中如果有函数、undefined、`symbol` 这几种类型，经过 `JSON.stringify` 序列化之后的字符串中这个键值对会消失；

+ 拷贝 `Date` 引用类型会变成字符串；

+ 无法拷贝不可枚举的属性；

+ 无法拷贝对象的原型链；

+ 拷贝 `RegExp` 引用类型会变成空对象；

+ 对象中含有 `NaN`、`Infinity` 以及`-Infinity`，`JSON` 序列化的结果会变成 `null`；

+ 无法拷贝对象的循环引用，即对象成环 (obj[key] = obj)。

## 2.手写递归实现

```js
function deepClone(target) {
    let cloneObj = {};

    for (let key in target) {
        if (typeof target[key] === 'object') {
            cloneObj[key] = deepClone(target[key])
        } else {
            cloneObj[key] = target[key]
        }
    }

    return cloneObj
}
```

存在的问题：

+ 这个深拷贝函数并不能复制不可枚举的属性以及 `Symbol` 类型；

+ 这种方法只是针对普通的引用类型的值做递归复制，而对于 `Array`、`Date`、`RegExp`、`Error`、`Function` 这样的引用类型并不能正确地拷贝；

+ 对象的属性里面成环，即循环引用没有解决。

### 3.进化版递归实现

解决上述简化版递归实现的深拷贝问题：

+ 针对能够遍历对象的不可枚举属性以及 `Symbol` 类型，我们可以使用 `Reflect.ownKeys` 方法；

+ 当参数为 `Date`、`RegExp` 类型，则直接生成一个新的实例返回；

+ 利用 `Object` 的 `getOwnPropertyDescriptors` 方法可以获得对象的所有属性，以及对应的特性，顺便结合 `Object` 的 `create` 方法创建一个新对象，并继承传入原对象的原型链；

+ 利用 `WeakMap` 类型作为 `Hash` 表，因为 `WeakMap` 是弱引用类型，可以有效防止内存泄漏，作为检测循环引用很有帮助，如果存在循环，则引用直接返回 `WeakMap` 存储的值。

```js
function deepClone(obj, hash = new WeakMap()) {
    // 1.针对循环引用
    if (hash.has(obj)) return hash.get(obj);
    // 2.针对Date和RegExp
    if (obj.constructor === Date || obj.constructor === RegExp) {
        return new obj.constructor(obj)
    }
    
    // 获取对象所有属性
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    // Object.getPrototypeOf(a) === a.__proto__  true
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
    // 记录一下
    hash.set(obj, cloneObj)
    for(let key of Reflect.ownKeys(obj)) {
        if(typeof obj[key] === 'object' && obj[key] !== null) {
            cloneObj[key] = deepClone(obj[key], hash)
        } else {
            cloneObj[key] = obj[key]
        }
    }
    
    return cloneObj
}
```
