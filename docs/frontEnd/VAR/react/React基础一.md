---
title: 【React】react基础《一》
date: 2019-11-11
categories: 
- 前端
tags: 
- JS
- React

---

:::tips

前端三大框架VAR，即Vue、Angular、React,是前端开发人员的三板斧，Angular是我入行以来一直用的框架，Vue前期也学过，现在，打算掌握最后一板斧。

:::

## 1. react简介

> [A JavaScript library for building user interfaces (用于构建用户界面的JavaScript库)](https://reactjs.org)

React.js是全球最火的前端框架（由facebook推出）**函数式编程**风格，react的社区 社区非常强大及其活跃，在react基础上衍生除了很多生态，比如：`react naive`、`react VR`。

+ ReactJS 用于web开发和组件的编写
+ ReactNative用于移动端开发
+ ReactVR用于虚拟现实技术的开发

## 2. react优点

- **生态强大**：现在没有哪个框架比React的生态体系好的，几乎所有开发需求都有成熟的解决方案。
- **上手简单**: 你甚至可以在几个小时内就可以上手React技术，但是他的知识很广，你可能需要更多的时间来完全驾驭它。
- **社区强大**：你可以很容易的找到志同道合的人一起学习，因为使用它的人真的是太多了。

## 3. 预备知识

+ html5 + css3基础
+ js基础，ES6基础
+ npm包管理

## 4. React开发环境搭建

### 4.1 将react当做普通库引入项目

使用 React 开发网页时，我们需要使用到 React 提供的两个 JavaScript 包，分别是 `react.js` 和 `react-dom.js`：

- react.js：提供 React 的顶级 API，是 React 的核心库，其核心思想是虚拟DOM（Virtual DOM）；
- react-dom.js：提供针对 DOM 操作的相关 API；

**值得注意的是：**`react-dom.js` 是基于 `react.js` 的，因此页面中需要保证 `react.js` 先加载！

另外，React 推荐开发者使用特殊的 JSX 语法来编写 UI 代码，对于初学者来讲，尝试 JSX 最快的方法是在页面中引入 `babel-standalone.js` 包：

```js
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>React 的初学者模板</title>
</head>
<body>

    <script src="https://cdn.staticfile.org/react/16.8.6/umd/react.development.js"></script>
    <script src="https://cdn.staticfile.org/react-dom/16.8.6/umd/react-dom.development.js"></script>
    <script src="https://cdn.staticfile.org/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        // 可以在这个 script 标签里使用 JSX 语法
    </script>
</body>
</html>
```

1. 模板中引入的是 React 提供的 development版本，它包含了完整的警告和调试模式，有助于初学者从一开始就遵循 React 约定好的开发规范；
2. 模板中的最后一个 script 标签指定了 type 属性为 `text/babel`，这是因为 React 推荐使用的 JSX 语法无法被浏览器内置的 JavaScript 引擎解析，需要使用 Babel 对其进行预编译，所以凡是使用了 JSX 语法的 script 标签都要加上 type = "text/babel"。

3. React 提供的 development 版本仅适用于开发环境，不适合生产环境，也就是说，在项目上线时，需要使用压缩优化后的 production.min.js版本；
4.  通过引入 babel-standalone.js 来编译 JSX 效率是非常低的，因为基于这种方式的编译过程完全运行在浏览器端，浏览器不仅要加载 babelstandalone.js 文件，还要借助此文件去编译 JSX，整个过程会比较耗时。所以在实际开发中，我们会在项目上线前先将 JSX 代码编译为 JS 代码，减轻浏览器的负担，从而提高用户体验！

### 4.2  使用官方脚手架 create-react-app

React 提供了一个官方的命令行工具（CLI）—— `create-react-app`，是专门用于快速搭建单页面应用（SPA）的脚手架，它基于 Webpack + ES6，无需开发者自行配置，只需通过一些命令就能快速构建 React 开发环境、运行项目，并带有热更新，且支持打包生成开发环境可用的构建版本。

```bash
// 前提是安装了node
npm i create-react-app -g        // 全局安装 create-react-app 脚手架
create-react-app project-name    // 通过 create-react-app 创建名为 project-name 的项目（项目名称不能使用大写英文）
```

通过上面命令，构建的项目

#### 4.2.1 项目根目录介绍

- `node_modules`：项目依赖；
- `package.json`：项目的描述文件，记录项目依赖的版本信息等；
- `public`： manifest.json 指定了开始页面为 index.html，是代码执行的源头；
- `src`：项目的源代码；
- `.gitignore`：用于 git，记录 git 所需忽略的文件；
- `package-lock.json`：锁定安装时的版本号，并且需要上传到git，以保证其他人再`npm install` 时大家的依赖能保证一致。

#### 4.2.2 public文件夹介绍

这个文件都是一些项目使用的公共文件，也就是说都是共用的，我们就具体看一下有那些文件吧。

- **favicon.ico** : 这个是网站或者说项目的图标，一般在浏览器标签页的左上角显示。
- **index.html** : 首页的模板文件，我们可以试着改动一下，就能看到结果。
- **mainifest.json**：移动端配置文件，这个会在以后的课程中详细讲解。

#### 4.2.3 src文件夹介绍

这个目录里边放的是我们开放的源代码，我们平时操作做最多的目录。

- **index.js** : 这个就是项目的入口文件，视频中我们会简单的看一下这个文件。
- **index.css** ：这个是`index.js`里的CSS文件。
- **app.js** : 这个文件相当于一个方法模块，也是一个简单的模块化编程。
- **serviceWorker.js**: 这个是用于写移动端开发的，PWA必须用到这个文件，有了这个文件，就相当于有了离线浏览的功能。

## 5. JSX语法简介

人们往往对未知的事物会心存畏惧，JSX没听过，没关系，其实，它就是一种JS方言，只不过标准的JS环境是不认识的，需要将其编译为JS代码，浏览器才能认识。

> JSX就是Javascript和XML结合的一种格式。React发明了JSX，可以方便的利用HTML语法来创建虚拟DOM，当遇到`<`，JSX就当作HTML解析，遇到`{`就当JavaScript解析.

```jsx
import React, {Component} from 'react'

// JSX构建组件
class App extends Component{
    render(){
        return (
            <div>
                <h1>你好呀~</h1>
                <h2>现在时间是 {new Date().toLocaleTimeString()}.</h2>
            </div>
        )
    }
}
export default App;
```

### 5.1 JS特点

JSX = JavaScript and XML，它有三个特点：

1. 编译后可运行于 JavaScript 环境；
2. 使用标签式的语法定义一个变量；
3. 在标签内部可以插入 JavaScript 表达式；

```js
import React from 'react'
const Component = React.Component
class App extends Component{
    render(){
        return ( // 必须使用()包裹
            // 在<>中写HTML
            <ul className="my-list">
            // 在{}中写JS代码
                <li>{false?'hello':'hi'}</li>
                <li>I love React</li>
            </ul>
        )
    }
}
export default App;
```

### 5.2 JSX本质

JSX 是由 JavaScript 实现的，它不是一种新的语言，而是基于 ECMAScript 的一种新特性，扩展了 JavaScript 语法而已。

本质上，JSX 就是调用`React.createElement`的语法糖，是声明 React 元素的另一种高效方式，不仅允许开发者在 JavaScript 中编写 DOM 结构，还可以在 DOM 节点里插入 JavaScript 表达式，从而更简单、更快速的实现数据绑定。

**JSX 的本质 API**：

```js
/**
*创建 React 元素
*@param component：组件名，可以是字符串表示的 HTML 元素，也可以是变量名表示的React.Component 子类；
*@param props：组件的属性对象；
*@param children：组件的子节点；
*/
React.createElement(component, props, ...children)
```

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="zkkysqs" data-slug-hash="QWWazXM" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React-JSX本质">
  <span>See the Pen <a href="https://codepen.io/zkkysqs/pen/QWWazXM">
  React-JSX本质</a> by zkkysqs (<a href="https://codepen.io/zkkysqs">@zkkysqs</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 5.3 JSX的优点

+ JSX 被编译为 JavaScript 代码时进行了优化，相比之下执行速度更快；
+ JSX 是类型安全的，在编译过程中就能发现错误；
+ 通过在不同平台上提供解释器，让跨平台成为了可能，从而诞生了 [React Native](https://facebook.github.io/react-native/)；

### 5.4 JSX注意事项

+ React要求必须在一个组件的最外层进行包裹，即要有且只能一个根元素，否则会报错

+ 不想有根元素包裹，用`<Fragment>`标签代替，在渲染时会去掉：

  ```js
  import React,{Component,Fragment } from 'react'
  
  class Hi extends Component{
      render(){
          return  (
              <Fragment>
                  <h1>你好呀~</h1>
              	<h2>现在时间是 {new Date().toLocaleTimeString()}.</h2>
              </Fragment>
          )
      }
  }
  export default Hi 
  ```

+ 自定义组件首字母必须大写

  ```js
  function Welcome (props) {
      return <h1>{ props.name }~ 你好呀！</h1>
  }
  ```

  React 会将小写字母开头的组件视为原生 DOM 标签，例如：`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件，并且需要在作用域内使用 `<Welcome />`。