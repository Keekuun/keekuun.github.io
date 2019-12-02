---
title: 【React】React Router
date: 2019-11-20
categories: 
- 前端
tags: 
- JS
- React
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

+ **Routers**：如 `<BrowserRouter>`和`<HashRouter>`组件，React Router的父组件，每个React Router组件都是**Routers**组件。
+ **Route Matchers** ：如 `<`<Route>`和`<Switch>`组件，我称之为**路由出口**，渲染UI部分。
+ **Navigation**：如 `<`<Link>`、`<NavLink>`和`<Redict>`组件，即**链接跳转**，一般会被渲染为`<a>`标签。

## Routers路由

## [hash和history两种模式的区别](https://www.jianshu.com/p/bfffb4b8c9fa)

Router组件，根据url模式的不同，分为history模式（对应`<BrowserRouter>`）和hash模式（对应`<HashRouter>`）。

先来理解这两种模式：

| 对比         | [hash模式](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/hash) | [history模式](https://developer.mozilla.org/zh-CN/docs/Web/API/History) |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| URL例子      | https://music.163.com/#/friendhttps://pan.baidu.com/disk/home#list/vmode=list | https://www.cnblogs.com/stdzz/p/11703829.html                |
| 特点         | 有特殊标识`#`                                                | 无                                                           |
| 对后端的影响 | **与后端配合疏松**：<br />hash 虽然出现在 URL 中，不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash **不会重新加载页面**；<br />`hash` 模式下，仅 `hash` 符号之前的内容会被包含在请求中，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。 | **与后端配合紧密**：<br />`history` 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 `http://www.abc.com/book/id`。如果后端缺少对 `/book/id` 的路由处理，将返回 404 错误。 |
| 各自特点     | 1.`hash` 设置的新值必须与原来不一样才会触发动作将记录添加到栈中。<br />2.`hash` 只可修改 `#` 后面的部分，因此只能设置与当前 URL 同文档的 URL`hash` <br />3.只可添加短字符串 | 1.`history.go(-2);`//后退两次 2.`history.go(2);`//前进两次 3.`history.back();` //后退 4.`history.forward(); `//前进<br />5.[`history.pushState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)<br />6.[`history.replaceState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) |

### BrowserRouter 组件

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

  

### HashRouter组件

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
## **Route**路由匹配

### Route组件

即路由出口，用来将匹配的URL对应的子组件UI渲染出来。

#### Route路由渲染方式

+ [`<Route component>`](https://reacttraining.com/react-router/web/api/Route/component)直接关联组件
+ [`<Route render>`](https://reacttraining.com/react-router/web/api/Route/render-func)调用`render`函数，在路由匹配的时候调用。
+ [`<Route children>` function](https://reacttraining.com/react-router/web/api/Route/children-func)调用`children`函数，类似于`render`函数，但不论路由是否匹配，都会被调用。

以上三种方式，在同一个`<Route>`中只能选择一种，如果写了多个，会被覆盖，`<Route children>` 的优先级更高。

```jsx
import { BrowserRouter as Router, Route } from "react-router-dom";

function Hello() {
  return <h1>Hello World!</h1>;
}

// component方式
ReactDOM.render(
  <Router>
    <Route path="/hello" component={Hello} />
  </Router>,
  node
);

// render方式
ReactDOM.render(
  <Router>
    <Route path="/hello" render={() => <Home />} />
  </Router>,
  node
);

// children方式
ReactDOM.render(
  <Router>
    <Route path="/hello" children={({ match }) => <Home />} />
  </Router>,
  node
);
```

#### Route路由匹配规则

+ [path:string |  string[]](https://reacttraining.com/react-router/web/api/Route/path-string-string)匹配的URL字符串

  ```jsx
  // 匹配一个
  <Route path="/users/:id">
    <User />
  </Route>
  
  // 匹配多个
  <Route path={["/users/:id", "/profile/:id"]}>
    <User />
  </Route>
  ```

+ [exact: bool](https://reacttraining.com/react-router/web/api/Route/exact-bool)是否精准匹配还是模糊匹配：

  ```jsx
  <Route exact path="/one">
    <About />
  </Route>
  ```

  根据`exact`的值匹配：

  | URL path | 目标URL    | exact的值 | 匹配与否 |
  | -------- | ---------- | --------- | -------- |
  | `/one`   | `/one/two` | `true`    | no       |
  | `/one`   | `/one/two` | `false`   | yes      |

+ [strict: bool](https://reacttraining.com/react-router/web/api/Route/strict-bool)是否开启严格模式，当值为true时，必须后面带斜杠才能匹配：

  ```jsx
  <Route strict path="/one/">
    <About />
  </Route>
  ```

  那么可以匹配：

  | URL path | 目标URL    | 匹配与否 |
  | -------- | ---------- | -------- |
  | `/one/`  | `/one`     | no       |
  | `/one/`  | `/one/`    | yes      |
  | `/one/`  | `/one/two` | yes      |

  如果必须匹配尾部没有斜杠的，那么 `strict` and `exact` 都得为`true`：

  ```jsx
  <Route exact strict path="/one">
    <About />
  </Route>
  ```

  | `/one` | `/one`     | yes  |
  | ------ | ---------- | ---- |
  | `/one` | `/one/`    | no   |
  | `/one` | `/one/two` | no   |

+ [sensitive: bool](https://reacttraining.com/react-router/web/api/Route/sensitive-bool)是否区分大小写，当为true时，区分大小写：

  ```jsx
  <Route sensitive path="/one">
    <About />
  </Route>
  ```

  | URL path | 目标URL | sensitive值 | 匹配与否 |
  | -------- | ------- | ----------- | -------- |
  | `/one`   | `/one`  | `true`      | yes      |
  | `/One`   | `/one`  | `true`      | no       |
  | `/One`   | `/one`  | `false`     | yes      |

### Switch组件

渲染第一个匹配的URL对应的 [`<Route>`](https://reacttraining.com/react-router/Route.md) 或 [`<Redirect>`](https://reacttraining.com/react-router/Redirect.md) 

```jsx
import { Route } from "react-router";

let routes = (
  <div>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </div>
);
```

如果URL为`/`，只使用`<Route>`，那么上面的两个路由都能匹配，会被同时渲染出来，如果加上`<Switch>`则只会渲染第一个匹配的URL：

```jsx
import { Route, Switch } from "react-router";

let routes = (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </Switch>
);
```

## **Navigation**路由跳转

### Link组件

提供路由跳转的链接，会被渲染为`<a>`标签：

```jsx
<Link to="/about">About</Link>
```

#### to属性

+ [to: string](https://reacttraining.com/react-router/web/api/Link/to-string)直接跟URL字符串：

  ```jsx
  <Link to="/courses?sort=name" />
  ```

+ [to: object](https://reacttraining.com/react-router/web/api/Link/to-object)对象中包含一系列属性

  + `pathname`: 跳转的路由.
  + `search`: url查询参数
  + `hash`: url的hash部分
  + `state`: State to persist to the `location`.

  ```jsx
  <Link
    to={{
      pathname: "/courses",
      search: "?sort=name",
      hash: "#the-hash",
      state: { fromDashboard: true }
    }}
  />
  ```

+ [to: function](https://reacttraining.com/react-router/web/api/Link/to-function)以当前的location作为参数，需要返回一个url字符串或者object来匹配to的合法参数。

  ```jsx
  <Link to={location => ({ ...location, pathname: "/courses" })} />
  <Link to={location => `${location.pathname}?sort=name`} />
  ```


#### replace属性

+ [replace: bool](https://reacttraining.com/react-router/web/api/Link/replace-bool)当值为true时，将会替换历史记录的当前URL

```jsx
<Link to="/courses" replace />
```

### NavLink组件

这是`<Link>`组件的升级版，可以给链接加上激活的样式或类名。

#### activeClassName属性

+ [activeClassName: string](https://reacttraining.com/react-router/web/api/NavLink/activeclassname-string)

给激活的URL加上类名：

```jsx
<NavLink to="/faq" activeClassName="selected">
  FAQs
</NavLink>
```

#### activeStyle属性

+ [activeStyle: object](https://reacttraining.com/react-router/web/api/NavLink/activestyle-object)给激活的URL加上样式：

  ```jsx
  <NavLink
    to="/faq"
    activeStyle={{
      fontWeight: "bold",
      color: "red"
    }}
  >
    FAQs
  </NavLink>
  ```

#### exact属性

+ [exact: bool](https://reacttraining.com/react-router/web/api/NavLink/exact-bool)当为true时，只有精准匹配的时候activeClassName或activeStyle属性才会生效：

```jsx
<NavLink exact to="/profile">
  Profile
</NavLink>
```

#### strict属性

+ [strict: bool](https://reacttraining.com/react-router/web/api/NavLink/strict-bool)当为true时，会严格匹配尾部的斜杠

```jsx
<NavLink strict to="/events/">
  Events
</NavLink>
```

#### isActive属性

+ [isActive: func](https://reacttraining.com/react-router/web/api/NavLink/isactive-func)返回布尔值，用来额外判断链接是否是激活的状态：

  ```jsx
  <NavLink
    to="/events/123"
    isActive={(match, location) => {
      if (!match) {
        return false;
      }
  
      // only consider an event active if its event id is an odd number
      const eventID = parseInt(match.params.eventID);
      return !isNaN(eventID) && eventID % 2 === 1;
    }}
  >
    Event 123
  </NavLink>
  ```

  

### Redirect组件

路由重定向到新的URL，会在历史记录中替换掉当前的URL，和HTTP 3xx表现类似：

```jsx
<Route exact path="/">
  {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
</Route>
```

#### to属性

+ [to: string](https://reacttraining.com/react-router/web/api/Redirect/to-string)路由重定向到URL：

  ```jsx
  <Redirect to="/somewhere/else" />
  ```

+ [to: object](https://reacttraining.com/react-router/web/api/Redirect/to-object)

  ```jsx
  <Redirect
    to={{
      pathname: "/login",
      search: "?utm=your+face",
      state: { referrer: currentLocation }
    }}
  />
  ```

#### push属性

+ [push: bool](https://reacttraining.com/react-router/web/api/Redirect/push-bool)若为true则会将重定向路由添加到历史记录中而不是替换：

```jsx
<Redirect push to="/somewhere/else" />
```

#### from属性

+ [from: string](https://reacttraining.com/react-router/web/api/Redirect/from-string)

  ```jsx
  <Switch>
    <Redirect from='/old-path' to='/new-path' />
    <Route path='/new-path'>
      <Place />
    </Route>
  </Switch>
  
  // Redirect with matched parameters
  <Switch>
    <Redirect from='/users/:id' to='/users/profile/:id'/>
    <Route path='/users/profile/:id'>
      <Profile />
    </Route>
  </Switch>
  ```

Redirect组件也有`strcict`、`sensitive`和`exact`属性，他们和Route组件对应的属性表现一致。

## Router Hooks

### useHistroy

### useLocation

### useParams

### useRouteMacth

## Router练习

### 获取path查询参数

### 获取params查询参数