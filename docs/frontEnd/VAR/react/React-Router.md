---
title: 【React】React Router
date: 2019-11-20
categories: 
- 前端
tags: 
- JS
- React
学子
---

> [React Router API](https://reacttraining.com/react-router/web/api/Hooks)学习笔记

# 快速开始

## 配置环境

```bash
// 全局安装create-react-app
npm install -g create-react-app
// 启动项目
create-react-app demo-app
cd demo-app
// 启动项目
npm  start 

// 安装react-router-dom 依赖
npm install react-router-dom --save
```

## 简单Demo

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="zkkysqs" data-slug-hash="KKwKddp" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React-router demo1">
  <span>See the Pen <a href="https://codepen.io/zkkysqs/pen/KKwKddp">
  React-router demo1</a> by zkkysqs (<a href="https://codepen.io/zkkysqs">@zkkysqs</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

> `react-router`是核心部分，是浏览器和原生应用的通用部分 。
>
> `react-router-dom`提供了**浏览器**使用需要的定制组件。
>
> `react-router-native`则专门提供了在**原生**移动应用中需要用到的部分。所以，如果在浏览器开发环境就只需要安装`react-router-dom`。

# React Router组件

React Router组件主要分为三大类：

+ **Routers**： `<BrowserRouter>`和`<HashRouter>`组件，React Router的父组件，每个React Router组件都是**Routers**组件。
+ **Route**：`<Route>`和`<Switch>`组件，我称之为**路由出口**，渲染UI部分。
+ **Navigation**：`<Link>`、`<NavLink>`和`<Redict>`组件，即**链接跳转**，一般会被渲染为`<a>`标签。

## Routers

## [hash和history两种模式的区别](https://www.jianshu.com/p/bfffb4b8c9fa)

Router组件，根据url模式的不同，分为history模式（对应`<BrowserRouter>`）和hash模式（对应`<HashRouter>`）。

先来理解这两种模式：

| 对比         | [hash模式](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/hash) | [history模式](https://developer.mozilla.org/zh-CN/docs/Web/API/History) |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| URL例子      | https://music.163.com/#/friendhttps://pan.baidu.com/disk/home#list/vmode=list | https://www.cnblogs.com/stdzz/p/11703829.html                |
| 特点         | 有特殊标识`#`                                                | 无                                                           |
| 对后端的影响 | **与后端配合疏松**：<br />hash 虽然出现在 URL 中，不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash **不会重新加载页面**；<br />`hash` 模式下，仅 `hash` 符号之前的内容会被包含在请求中，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。 | **与后端配合紧密**：<br />`history` 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 `http://www.abc.com/book/id`。如果后端缺少对 `/book/id` 的路由处理，将返回 404 错误。 |
| 各自特点     | 1.`hash` 设置的新值必须与原来不一样才会触发动作将记录添加到栈中。<br />2.`hash` 只可修改 `#` 后面的部分，因此只能设置与当前 URL 同文档的 URL`hash` <br />3.只可添加短字符串 | 1.`history.go(-2);`//后退两次 2.`history.go(2);`//前进两次 3.`history.back();` //后退 4.`history.forward(); `//前进<br />5.[`history.pushState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)<br />6.[`history.replaceState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) |

### BrowserRouter 

使用HTML5 history API更新页面，组件API：

```jsx
<BrowserRouter
  basename={optionalString}
  forceRefresh={optionalBool}
  getUserConfirmation={optionalFunc}
  keyLength={optionalNumber}
>
  <Children />
</BrowserRouter>
```

+ basename：string，为路由添加root url，需要以`/`开头，但是尾部不需要`/`：

  ```jsx
  <BrowserRouter basename="/calendar" />
  <Link to="/today"/> // renders <a href="/calendar/today">
  ```

+ getUserConfirmation：func，使用[window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)，会出现一个路由离开确认对话框：

  ```jsx
  <BrowserRouter
    getUserConfirmation={(message, callback) => {
      // this is the default behavior
      const allowTransition = window.confirm(message);
      callback(allowTransition);
    }}
  />
  ```

+ forcerefresh：bool，如果值为`true`会强制刷新整个页面：

  ```jsx
  <BrowserRouter forceRefresh={true} />
  ```

+ keyLength：number，`location.key`的长度，默认为6：

  ```jsx
  <BrowserRouter keyLength={12} />
  ```

+ children：node，需要被渲染的子组件，在react16版本之前，只能有一个子节点，若想包裹多个，需要使用`<div>`包裹。react16版本之后，可以有多个子节点。

  ```jsx
  <BrowserRouter
    basename={''}
    forceRefresh={false}
    getUserConfirmation={() => {}}
    keyLength={6}
  >
      <div>
      	<Children1 />
          <Children2 />
      </div>
  </BrowserRouter>
  ```

  

### HashRouter

使用URL的hash部分来更新页面，组件API：

```jsx
<HashRouter
  basename={optionalString}
  getUserConfirmation={optionalFunc}
  hashType={optionalString}
>
  <App />
</HashRouter>
```

+ basename: string，为路由添加root url，需要以`/`开头，但是尾部不需要`/`：

  ```jsx
  <HashRouter basename="/calendar"/>
  <Link to="/today"/> // renders <a href="#/calendar/today">
  ```

+ getuserConfirmation：func，同`<BrowserRouter >`

+ hashType：string，根据值的不同，使`#`在URL位置不同，默认`slash`模式：

  + `slash`：如  `#/` 和`#/sunshine/lollipops` 
  + `noslash`：如 `#` 和`#sunshine/lollipops` 
  + `hashbang`：如 `#!/` 和`#!/sunshine/lollipops` 

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="zkkysqs" data-slug-hash="NWPWGvP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React-router HashRouter和BrowserRouter">
  <span>See the Pen <a href="https://codepen.io/zkkysqs/pen/NWPWGvP">
  React-router HashRouter和BrowserRouter</a> by zkkysqs (<a href="https://codepen.io/zkkysqs">@zkkysqs</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## **Route**

## **Navigation**