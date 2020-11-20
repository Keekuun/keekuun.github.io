---
title: 【JS】ES6-数组方法及其实现
date: 2019-10-01
sidebar: auto
categories: 
- 前端
tags: 
- JS
- ES6
---

## 1. 扩展运算符(spread)

扩展运算符（spread）是三个点（`...`）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

### 1.1 替代函数的apply方法

```js
Math.max(1,2,3); // 3
Math.max.apply(null, [1,2,3]); // 3
Math.max(...[1,2,3]);
```

### 1.2 作为rest参数的逆运算

**..rest 参数必须放到参数列表的末尾**

```js
function a(...rest){
    console.log(rest);
    console.log(...arguments);
}
a(1,2,3,4); 
// [1,2,3,4]
// 1 2 3 4

b = (...rest) => {console.log(rest)};
b(1,2,3,4) // [1,2,3,4]
```

...rest参数和arguments的区别：

+ 属性：arguments包括所有的实参，还包含其他属性如callee，rest只包括没有对应形参的实参。
+ 数组：arguments是类数组，不是真正的数组实例，rest是真正的数组实例。
+ 位置：arguments存在用`function`申明的所有函数中，**在当前箭头函数中不存在arguments**，rest必须显示申明在函数的形参中，且**...rest必须是最后一个形参**。

### 1.3  作用于数组

#### 1.3.1 合并数组

```js
const a = [1,2,3];
const b = [4,5,6];
// es5
const c = a.concat(b); // [1,2,3,4,5,6]
// now
const d = [...a,...b]; // [1,2,3,4,5,6]
```

#### 1.3.2 复制数组

浅复制，只能复制一层：

只有一层的话，就是完整的克隆，修改其中一个不会相互影响；

有内层数组的话，内层是引用，修改其中一个内层数组，另一个也会变化；

```js
const a1 = [1,2,3];
const b1= [...a1];
// 或者
const [...b2] = a1;

const a1 = [1,2,[3,4]];
const b3 = [...a1];
b3[2].pop();
a1; // [1,2, [3]]
```

#### 1.3.3 交换数值

```js
let x = 1;
let y = 2;
[x, y] = [y, x];
```

#### 1.3.4 数组解构

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// 报错
```

如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。

#### 1.3.5 将字符串转为数组

```js
[...'hello']
// ["h", "e", "l", "l", "o"]
```

#### 1.3.6 作用于Iterator

```js
// 实现了 Iterator 接口的对象
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

// Map 和 Set 结构
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]

// Generator 函数
const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

## 2. 数组方法学习

### 2.1 Array.from

+ 语法：`Array.from(arrayLike[, mapFn[, thisArg]])`返回一个新的数组实例

`Array.from`方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。[可遍历（iterable）又称可迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

只要是部署了 Iterator 接口的数据结构，`Array.from`都能将其转为数组。

```js
let arrLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// es5
var arr1 = [].slice.call(arrLike); // ['a', 'b', 'c'];

// es6
let arr2 = Array.from(arrLike);
```

`Array.from()` 方法有一个可选参数 `mapFn`，让你可以在最后生成的数组上再执行一次 [`map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 方法后再返回。也就是说` Array.from(obj, mapFn, thisArg) `就相当于` Array.from(obj).map(mapFn, thisArg)`。

```js
Array.from([1, 2, 3], x => x + x); //  [2, 4, 6]
Array.from({length: 5}, (v, i) => i); // [0, 1, 2, 3, 4]
Array.from([1, , 2, , 3], (n) => n || 0); // [1, 0, 2, 0, 3]
```

对于没有实现`Array.from`方法的浏览器，可以使用[Polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill)替代。

### 2.2 Array.of

+ 语法：`Array.of(element0[, element1[, ...[, elementN]]])`

`Array.of`方法用于将一组值，转换为数组。是为了弥补数组构造函数`Array()`的不足，因为参数个数的不同，会导致`Array()`的行为有差异。

```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

Array() // []
Array(3) // [, , ,] ？？
Array(3, 11, 8) // [3, 11, 8]
```

`Array.of`基本上可以用来替代`Array()`或`new Array()`，并且不存在由于参数不同而导致的重载。它的行为非常统一。

`Array.of`方法可以用下面的代码模拟实现。

```javascript
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments);
  };
}
```

> [`Array.of 和` `Array.from` proposal](https://gist.github.com/rwaldron/1074126) 和 [`Array.of` polyfill实现](https://gist.github.com/rwaldron/3186576)

### 2.3 Array.isArray

+ 语法：`Array.isArray(obj)`

**Array.isArray()** 用于确定传递的值是否是一个 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array):

```js
Array.isArray([1, 2, 3]);  
// true
Array.isArray({foo: 123}); 
// false
Array.isArray("foobar");   
// false
Array.isArray(undefined);  
// false
```

当检测Array实例时, `Array.isArray` 优于 `instanceof,因为Array.isArray能检测iframes`.

手动实现：

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

```

### 2.4  Array.prototype.copyWithin

+ 语法：`arr.copyWithin(target[, start[, end]])` 参数 target、start 和 end 必须为整数。

  + target（必需）：0 为基底的索引，复制序列到该位置。如果是负数，`target` 将从末尾开始计算。如果 `target` 大于等于 `arr.length`，将会不发生拷贝。如果 `target` 在 `start` 之后，复制的序列将被修改以符合 `arr.length`。

  + start（可选）：0 为基底的索引，开始复制元素的起始位置。如果是负数，`start` 将从末尾开始计算。

    如果 `start` 被忽略，`copyWithin` 将会从0开始复制。

  + end（可选）：0 为基底的索引，开始复制元素的结束位置。`copyWithin` 将会拷贝到该位置，**但不包括 `end` 这个位置的元素**。如果是负数， `end` 将从末尾开始计算。如果 `end` 被忽略，`copyWithin` 方法将会一直复制至数组结尾（默认为 `arr.length`）。

```js
let numbers = [1, 2, 3, 4, 5];

numbers.copyWithin(-2);
// 先复制 		 [1,2,3,4,5]
// 再替换 [1,2,3,4,5]	
// 		 [1,2,3,1,2]

numbers.copyWithin(0, 3);
// 先复制[4,5]
// 再替换[1,2,3,4,5]
//       [4,5,3,4,5]


numbers.copyWithin(0, 3, 4);
// 先复制[4]
// 再替换[1,2,3,4,5]
// 		[4, 2, 3, 4, 5]
```

> [Array.prototype.copyWithin方法的 Polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin#Polyfill)

### 2.5 Array.prototype.find和Array.prototype.findIndex()

+ find语法：`arr.find(callback[, thisArg])`返回数组中满足提供的测试函数的**第一个**元素的值

+ findIndex语法：`arr.findIndex(callback[, thisArg])`返回数组中满足提供的测试函数的第一个元素的**索引**。否则返回-1。

  ```js
  [1, 4, -5, 10].find((n) => n < 0)
  // -5
  [1, 5, 10, 15].find(function(value, index, arr) {
    return value > 9;
  }) // 10
  
  [1, 5, 10, 15].findIndex(function(value, index, arr) {
    return value > 9;
  }) // 2
  ```

  找出数组中的质数：

  ```js
  function isPrime(element, index, array) {
    var start = 2;
    while (start <= Math.sqrt(element)) {
      if (element % start++ < 1) {
        return false;
      }
    }
    return element > 1;
  }
  
  console.log([4, 6, 8, 12].find(isPrime)); // undefined, not found
  console.log([4, 5, 8, 12].find(isPrime)); // 5
  
  console.log([4, 6, 8, 12].findIndex(isPrime)); // -1, not found
  console.log([4, 6, 7, 12].findIndex(isPrime)); // 2
  ```

  可见，两者的参数和`forEach`的参数是一毛一样的。

### 2.6  Array.prototype.fill

+ 语法：`arr.fill(value[, start[, end]])`用一个**固定值(value)填充**一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

```js
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

### 2.7 Array.prototype.entries、keys和values

+ entries语法：`arr.entries()`

  `entries()`方法返回一个新的`Array Iterator`对象，该对象包含数组中每个索引的**键/值**对。

+ values语法：`arr.values()`

  `values`()方法返回一个新的 `Array Iterator`对象，该对象包含数组每个索引的**值**

+ keys语法：`arr.keys()`

  `keys()` 方法返回一个包含数组中每个索引键的`Array Iterator`对象。

```js
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

### 2.8  Array.prototype.includes

+ 语法：`arr.includes(valueToFind[, fromIndex])`

用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。

```js
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```

还可以传入第二个参数表示搜索的起始位置，默认为`0`。

如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为`-4`，但数组长度为`3`），则会重置为从`0`开始。

```js
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

用来替代`arr.prototype.indexof()`方法。

### 2.9 Array.prototype.flat()和Array.prototype.flatMap()

俗称 “数组扁平化”处理：

+ flat语法：`var newArray = arr.flat([depth])`,**数组降维**，**摊平**，depth默认值为 1

按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。  

```js
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]

[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]
```



+ flatMap语法：

  ```
  var new_array = arr.flatMap(function callback(currentValue[, index[, array]]) {
      // 返回新数组的元素
  }[, thisArg])
  ```

`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组。

```js
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]

// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap(x => [[x * 2]])
// [[2], [4], [6], [8]]
```

手动实现flat方法：

```js
// depth-扁平层数
Array.prototype.flattenArr = function(arr, depth=1){
    let res = [];
    // 遍历每一项
    arr.forEach(v => {
        // 判断子项是否为数组，是否已达到指定深度
        if(Array.isArray(v) && depth > 0){
            // 递归调用
            res.push(...flattenArr(v, --depth)) 
        }else{
            res.push(v)
        }
    })
    return res;
}
```







