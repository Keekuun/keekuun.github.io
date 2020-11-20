---
title: 【React】React基础
date: 2019-11-11
sidebar: auto
categories: 
- 前端
- React
tags: 
- JS
- React
---

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

```jsx
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
create-react-app project-name    // 通过 create-react-app 创建名为 project-name 的项目,项目名称不能使用大写英文
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
