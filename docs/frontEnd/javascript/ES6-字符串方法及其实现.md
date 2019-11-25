---
title: 【JS】ES6-字符串方法及其实现
date: 2019-9-28
categories: 
- 前端
tags: 
- JS
- ES6
---

## 1.模板字符串

模板字符串替换`+`操作符，来拼接字符串，并且支持换行：

```js
const name = 'zkk';
const getAge = () => 20;
const hello = 'hello, ' + zkk + '.How old are you?';
// 使用模板字符串
const hi = `hello, ${name}.How old are you?`;
// 模板字符串调用函数
const str = `I am ${getAge()}.`;
// 模板字符串中计算
`${4+5}`
// 模板字符串引用对象属性
let obj = {x: 1, y: 2};
`${obj.x + obj.y}`;
```

**标签模板**：

标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。

```js
alert`123`
// 等同于
alert(123)

```

如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数。

```javascript
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

## 2. String.raw转义

**`String.raw()`** 是一个[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)的标签函数，它的作用类似于 Python 中的字符串前缀 `r`，通常使用标签模板的形式（**String.raw模板字符串**)，返回值是**自动转义**的字符串：

```js
// 常用形式
let name = "Bob";
String.raw `Hi\n${name}!`;             
// "Hi\nBob!"

// 正常函数形式
// `foo${1 + 2}bar`
// 等同于
String.raw({ raw: ['foo', 'bar'] }, 1 + 2) // "foo3bar"
```

## 3. String.prototype.includes、startsWidth、endsWidth包含

+ `includes(searchStr[, position])`方法用于判断一个字符串是否**包含**str.在另一个字符串中，根据情况返回 true 或 false。

+ `str.startsWith(searchStr[, position)` 方法用来判断当前字符串是否以另外一个给定的子字符串**开头**，并根据判断结果返回 `true` 或 `false`。

  (position可选,从当前字符串的哪个索引位置开始搜寻子字符串，默认值为0。)

+ `str.endsWith(searchStr[, length])`方法用来判断当前字符串是否是以另外一个给定的子字符串“**结尾**”的，根据判断结果返回 `true` 或 `false`。(length作为 `str` 的长度。默认值为 `str.length`)

```js
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

s.startsWith('world', 6) // true 从index为n开始
s.endsWith('Hello', 5) // true 前n个字符
s.includes('Hello', 6) // false 从index为n开始
```

​	Polyfill:

```js
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, pos) {
            pos = !pos || pos < 0 ? 0 : +pos;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
```



## 4.String.prototype.repeat重复

`repeat`方法返回一个新字符串，表示将原字符串重复`n`次。语法：

```js
/** 
 * str: String
 * count: Number
 */
let resultString = str.repeat(count); 
// 如果repeat的参数是负数或者Infinity，会报错。
```

```js
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
'na'.repeat(NaN) // "" 参数NaN等同于 0
```

## 5. String.prototype.padStart、padEnd补全

如果某个字符串不够指定长度，会在头部或尾部补全。`padStart()`用于头部补全，`padEnd()`用于尾部补全。

+ `str.padStart(targetLength [, padString])`用另一个字符串填充当前字符串(重复，如果需要的话)，以便产生的字符串达到给定的长度。填充从当前字符串的开始(左侧)应用的。

+ `str.padEnd(targetLength [, padString])`用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。

```js
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

// 如果省略第二个参数，默认使用空格补全长度。
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

## 6. String.prototype.trim、trimRight(trimEnd)、trimLeft(trimStart)去空

`trimLeft()`是`trimStart()`的别名，`trimRight()`是`trimEnd()`的别名。

+ **trim()** 方法会从一个字符串的**两端**删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR）。
+ **trimRight()** 方法从一个字符串的**右端**移除空白字符。又称`trimEnd`
+ **trimLeft()** 方法从一个字符串的**右端**移除空白字符。又称`trimStart`

```js
const h = ' hello world! ';

h.trim();// 'hello world!'

h.trimLeft(); // 'hello world! '
h.trimStart(); //'hello world! '

h.trimEnd(); // ' hello world!'
h.trimRight(); // ' hello world!'
```

除了空格键，对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

## 7. String.prototype.substring和slice截取

**substring()** 方法返回一个字符串在开始索引到结束索引之间的一个子集, 或从开始索引直到字符串的末尾的一个子集。返回新的字符串，不改变原来的字符串

`str.substring(indexStart[, indexEnd])`: indexStart需要截取的第一个字符的索引，该字符作为返回的字符串的首字母。indexEnd]可选**,一个 0 到字符串长度**之间的整数，以该数字为索引的字符**不包含**在截取的字符串内。**左闭右开**

```js
const h = 'helloworld!';
// 如果省略 indexEnd，substring 提取字符一直到字符串末尾。
h.substring(5) // 'world!'
// 如果任一参数小于 0 或为 NaN，则被当作 0。
h.substring(0,5) // 'hello'
h.substring(-1,5) // 'hello'
// 如果 indexStart 等于 indexEnd，substring 返回一个空字符串。
h.substring(5,5) // ''
// 如果任一参数大于 stringName.length，则被当作 stringName.length。
h.substring(0,100) //'helloworld!'
// 如果 indexStart 大于 indexEnd，则 substring 的执行效果就像两个参数调换了一样。
h.substring(-5,5); // 'hello';
h.substring(5,-5); // 'hello';
```

**slice()** 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

`str.slice(beginIndex[, endIndex])`参数和substring一样，只不过有差异。和上面方式对比：

```js
const h = 'helloworld!';
h.slice(5); // 'world!' 同substring
h.slice(0,5); // "hello" 同substring

h.slice(-1,5); // '' 不同substring

h.slice(5,5); // '' 同substring

h.slice(0,100); // "helloworld!" 同substring

h.slice(-5,5); // '' 不同substring

h.slice(5,-5); // 'w' 不同substring

h.slice(-6); // "world!"
```

可见`slice`方式的索引是可以倒数的，**强烈推荐**使用`slice`方式截取字符串更好理解，不易出错。

其实JS中截取字符串，方法有很多：`substr(淘汰，不推荐)`、`substring`、`slice`，推荐使用`slice`方式。