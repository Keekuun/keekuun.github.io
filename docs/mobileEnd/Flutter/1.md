---
title: Dart语言基础
sidebar: auto
isComment: true
categories:
- 移动端
tags:
- 跨平台
- 移动端
- flutter
- dart
---

# Dart语言基础

## 1.注释
Dart的注释分为3种：单行注释、多行注释、文档注释。

+ 单行注释 `// 单行注释`
```dart
void main() {
  // hello world
  print('hello world');
}
```

+ 多行注释`/* 多行注释 */`
```dart
void main() {
  for (var i = 0; i < 4; i++) {
    print('hello $i');
  }
}

/**
* hello 0
* hello 1
* hello 2
* hello 3
*/
```

+ 文档注释`/// 文档注释`

可以通过`dartdoc`命令导出文档

```dart
void main() {
  var i = 20;
  print('fibonacci($i) = ${fibonacci(i)}');
}

/// Computes the nth Fibonacci number.
int fibonacci(int n) {
  return n < 2 ? n : (fibonacci(n - 1) + fibonacci(n - 2));
}
```



## 2.关键字（60个）

[Dart 语言关键字列表](https://www.dartcn.com/guides/language/language-tour#%E5%85%B3%E9%94%AE%E5%AD%97)：

| [abstract](https://www.dartcn.com/guides/language/language-tour#抽象类) 2 | [dynamic](https://www.dartcn.com/guides/language/language-tour#重要的概念) 2 | [implements](https://www.dartcn.com/guides/language/language-tour#隐式接口) 2 | [show](https://www.dartcn.com/guides/language/language-tour#导入库的一部分) 1 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [as](https://www.dartcn.com/guides/language/language-tour#类型判定运算符) 2 | [else](https://www.dartcn.com/guides/language/language-tour#if-和-else) | [import](https://www.dartcn.com/guides/language/language-tour#使用库) 2 | [static](https://www.dartcn.com/guides/language/language-tour#类变量和方法) 2 |
| [assert](https://www.dartcn.com/guides/language/language-tour#assert) | [enum](https://www.dartcn.com/guides/language/language-tour#枚举类型) | [in](https://www.dartcn.com/guides/language/language-tour#for-循环) | [super](https://www.dartcn.com/guides/language/language-tour#扩展类继承) |
| [async](https://www.dartcn.com/guides/language/language-tour#异步支持) 1 | [export](https://www.dartcn.com/guides/libraries/create-library-packages) 2 | [interface](https://stackoverflow.com/questions/28595501/was-the-interface-keyword-removed-from-dart) 2 | [switch](https://www.dartcn.com/guides/language/language-tour#switch-和-case) |
| [await](https://www.dartcn.com/guides/language/language-tour#异步支持) 3 | [extends](https://www.dartcn.com/guides/language/language-tour#扩展类继承) | [is](https://www.dartcn.com/guides/language/language-tour#类型判定运算符) | [sync](https://www.dartcn.com/guides/language/language-tour#生成器) 1 |
| [break](https://www.dartcn.com/guides/language/language-tour#break-和-continue) | [external](https://stackoverflow.com/questions/24929659/what-does-external-mean-in-dart) 2 | [library](https://www.dartcn.com/guides/language/language-tour#库和可见性) 2 | [this](https://www.dartcn.com/guides/language/language-tour#构造函数) |
| [case](https://www.dartcn.com/guides/language/language-tour#switch-和-case) | [factory](https://www.dartcn.com/guides/language/language-tour#工厂构造函数) 2 | [mixin](https://www.dartcn.com/guides/language/language-tour#为类添加功能mixins) 2 | [throw](https://www.dartcn.com/guides/language/language-tour#throw) |
| [catch](https://www.dartcn.com/guides/language/language-tour#catch) | [false](https://www.dartcn.com/guides/language/language-tour#booleans) | [new](https://www.dartcn.com/guides/language/language-tour#使用构造函数) | [true](https://www.dartcn.com/guides/language/language-tour#booleans) |
| [class](https://www.dartcn.com/guides/language/language-tour#实例变量) | [final](https://www.dartcn.com/guides/language/language-tour#final-和-const) | [null](https://www.dartcn.com/guides/language/language-tour#默认值) | [try](https://www.dartcn.com/guides/language/language-tour#catch) |
| [const](https://www.dartcn.com/guides/language/language-tour#final-和-const) | [finally](https://www.dartcn.com/guides/language/language-tour#finally) | [on](https://www.dartcn.com/guides/language/language-tour#catch) 1 | [typedef](https://www.dartcn.com/guides/language/language-tour#typedefs) 2 |
| [continue](https://www.dartcn.com/guides/language/language-tour#break-和-continue) | [for](https://www.dartcn.com/guides/language/language-tour#for-循环) | [operator](https://www.dartcn.com/guides/language/language-tour#重写运算符) 2 | [var](https://www.dartcn.com/guides/language/language-tour#变量) |
| [covariant](https://www.dartcn.com/guides/language/sound-problems#the-covariant-keyword) 2 | [Function](https://www.dartcn.com/guides/language/language-tour#函数) 2 | [part](https://www.dartcn.com/guides/libraries/create-library-packages#organizing-a-library-package) 2 | [void](https://medium.com/dartlang/dart-2-legacy-of-the-void-e7afb5f44df0) |
| [default](https://www.dartcn.com/guides/language/language-tour#switch-和-case) | [get](https://www.dartcn.com/guides/language/language-tour#getters-和-setters) 2 | [rethrow](https://www.dartcn.com/guides/language/language-tour#catch) | [while](https://www.dartcn.com/guides/language/language-tour#while-和-do-while) |
| [deferred](https://www.dartcn.com/guides/language/language-tour#延迟加载库) 2 | [hide](https://www.dartcn.com/guides/language/language-tour#导入库的一部分) 1 | [return](https://www.dartcn.com/guides/language/language-tour#函数) | [with](https://www.dartcn.com/guides/language/language-tour#为类添加功能mixins) |
| [do](https://www.dartcn.com/guides/language/language-tour#while-和-do-while) | [if](https://www.dartcn.com/guides/language/language-tour#if-和-else) | [set](https://api.dartlang.org/stable/dart-core/Set-class.html) 2 | [yield](https://www.dartcn.com/guides/language/language-tour#生成器) 3 |

###  2.1上下文关键字（5个）

带有 **1** 上标的单词为 **上下文关键字**， 仅在特定位置具有含义。 他们在任何地方都是有效的标识符。

| 关键字 |  | |  | |
| ----- | ---- | ---- | ---- | ---- |
| async | hide | on   | show | sync |

### 2.2内置标识符（20个）

带有 **2** 上标的单词为 **内置标识符**， 为了简化将 JavaScript 代码移植到 Dart 的工作， 这些关键字在大多数地方有效的标识符， 但它们不能用作类或类型名称，也不能用作 import 前缀。

| 关键字    | -       | -          | -        |
| --------- | ------- | ---------- | -------- |
| abstract  | as      | covariant  | deferred |
| dynamic   | export  | external   | factory  |
| Function  | get     | implements | import   |
| interface | library | mixin      | operator |
| part      | set     | static     | typedef  |

### 2.3异步功能的关键字（2个）

带有 **3** 上标的单词是与 Dart 1.0 发布后添加的[异步支持](https://www.dartcn.com/guides/language/language-tour#异步支持)相关的更新，作为限制类保留字。
不能在标记为 `async` ，`async*` 或 `sync*` 的任何函数体中使用 `await` 或 `yield` 作为标识符。

|   关键字     |       |
| ------ | ----- |
| await  | yield |

### 2.4 其他保留字（33个）

不能将保留字用作标识符。

| 关键字 | -       | -        | -       |
| ------ | ------- | -------- | ------- |
| assert | break   | case     | catch   |
| class  | const   | continue | default |
| do     | else    | enum     | extends |
| false  | final   | finally  | for     |
| if     | in      | is       | new     |
| null   | rethrow | return   | super   |
| switch | this    | throw    | true    |
| try    | var     | void     | while   |
| with   | -       | -        | -       |

## 3.变量和常量

### 3.1变量申明

+ `var`：类似于`ts`，使用`var`申明变量并初始化会自动推测其类型，可以再次赋值，但不能更改类型；但是如果先申明之后再初始化，是可以再次改变类型的

```dart
// 1.直接申明并且初始化，推荐
var msg1 = 'Hello world!'; // String
msg1 = 'xx';
msg1 = 111; // 抛出Error

// 2.先声明在初始化
var msg2;
print(msg.runtimeType); // Null

msg2 = 'Hello';
print(msg.runtimeType); // String

msg2 = 111;
print(msg.runtimeType); // int
```

+ `dynamic`：见名知意，申明一个动态类型，可以随时改变其类型（或者使用Object效果一样，推荐使用dynamic）

```dart
void main() {
  dynamic data = 1; 	// int
  data = 'hello';	// String
  print('hello $data');
}
```

+ `String、int...`：显式声明。词语法类似于java的变量类型申明，一旦申明之后类型不可改变也不可能再次赋值。

```dart
void main() {
  int data1 = 1; 	// int
    data2 = 2; 		// 不可再次赋值Error
    data2 = '1'; 	// 不可再次赋值，更不能改变类型Error
  String data2 = 'hello';	// String
  print('hello $data1 $data2');
}
```

### 3.2默认值

未初始化的变量的初始值为null（包括数字），因此数字、字符串都可以调用各种方法。

```dart
void main() {
  int data1; 	// int
  String data2;	// String
    
  print(data1 == null); // true
  print(data1 == Null); // false
    
  print(data1.runtimeType); // Null
  print(data1.runtimeType); // Null
  print('hello $data1 $data2'); // hello null null
}
```



### 3.3`final` 和 `const`

类似于ts,`final`和`const`用来申明并初始化一个值不在改变的变量。

+ 被`final`或者`const`修饰的变量，变量类型可以省略（和`var`一样）。

+ 被 `final` 或 `const` 修饰的变量无法再去修改其值（相当于常量定义）。

+ `flnal` 或者 `const` 不能和 `var` 同时使用（在类中可以和static一起使用，定义静态类型）。

  ```dart
  class Circle {
    double radius;
    // 定义静态类型
    static final PI = 3.14;
      
    // 构造方法
    Circle(this.radius);
  
    double get area => Circle.PI * math.pow(radius, 2);
  }
  
  void main() {
    print(Circle(2).area);
  }
  ```

  

+ 常量的运算：

  ```dart
  const speed = 100; //速度（km/h）
  const double distance = 2.5 * speed; // 距离 = 速度 * 时间
  
  final speed2 = 100; //速度（km/h）
  final double distance2 = 2.5 * speed2; // 距离 = 速度 * 时间
  ```

+ `const`关键字不只是声明常数变量。您也可以使用它来创建常量值，以及声明创建常量值的构造函数。 任何变量都可以有一个常量值。

  ```dart
  // 注意: [] 创建的是一个空的list集合
  // const []创建一个空的、不可变的列表（EIL）。
  var varList = const []; // varList 当前是一个EIL
  final finalList = const []; // finalList一直是EIL
  const constList = const []; // constList 是一个编译时常量的EIL
  
  // 可以更改非final,非const变量的值
  // 即使它曾经具有const值
  varList = ["haha"];
  
  // 不能更改final变量或const变量的值
  // 这样写，编译器提示：a final variable, can only be set once
  // finalList = ["haha"];
  // 这样写，编译器提示：Constant variables can't be assigned a value  
  // constList = ["haha"];
  ```

  

## 4.数据类型

## 5.运算符

## 6.控制流程语句

## 7.函数

## 8.类

## 9.泛型

## 10.错误处理



> [推荐：Effective Dart: 编程规范](https://www.dartcn.com/guides/language/effective-dart/design#types)