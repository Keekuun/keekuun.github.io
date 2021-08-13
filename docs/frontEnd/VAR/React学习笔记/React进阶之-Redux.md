---

title: 【React】React redux
date: 2020-10-17
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---

# 1.简介
Redux是react状态管理工具， 还有如Flux、Reflux、Mobx 等其他状态管理库可供选择

# 2.Store

**首先区分`state`与`store`**:

`state` 是应用的状态，一般本质上是一个普通对象

`store` 是应用状态 state 的管理者，包含下列四个函数：

+ `getState()` # 获取整个 `state`
+ `dispatch(action)` # ※ 触发 `state` 改变的【唯一途径】※
+ `subscribe(listener)` # 您可以理解成是 `DOM` 中的 `addEventListener`
+ `replaceReducer(nextReducer)` # 一般在 Webpack Code-Splitting 按需加载的时候用

**二者的关系是：`state = store.getState()`**

Redux 规定，一个应用只应有一个**单一的 store**，其管理着唯一的应用状态 state
Redux 还规定，不能直接修改应用的状态 state，也就是说，下面的行为是不允许的：

```js
var state = store.getState()
state.counter = state.counter + 1 // 禁止在业务逻辑中直接修改 state
```

**若要改变 state，必须 dispatch 一个 action，这是修改应用状态的不二法门**

 **action 只是一个包含 type 属性的普通对象即可**。例如 `{ type: 'INCREMENT' }`

上面提到，`state` 是通过 `store.getState()` 获取，那么 store 又是怎么来的呢？
想生成一个 `store`，我们需要调用 Redux 的 `createStore`：

```js
import { createStore } from 'redux'

// store 是靠传入 reducer 生成的哦！
const store = createStore(reducer, initialState) 
```

 **reducer 是一个 函数，负责更新并返回一个新的 state**,而 initialState 主要用于前后端同构的数据同步（详情请关注 React 服务端渲染）

# 3.Action

**action（动作）实质上是包含 type 属性的普通对象**，这个 `type` 是我们实现用户行为追踪的关键
例如，增加一个待办事项 的 `action` 可能是像下面一样：

```
{
  type: 'ADD_TODO',
  payload: {
    id: 1,
    content: '待办事项1',
    completed: false
  }
}
```

刨根问底，`action` 是谁生成的呢？ —— `Action Creator`

顾名思义，`Action Creator` 是 action 的创造者，本质上就是一个**函数**，返回值是一个 `action`（**对象**）
例如下面就是一个 “新增一个待办事项” 的 `Action Creator`：

```js
var id = 1
function addTodo(content) {
  return {
    type: 'ADD_TODO',
    payload: {
      id: id++,
      content: content, // 待办事项内容
      completed: false  // 是否完成的标识
    }
  }
}
```

# 4.Reducer

**reducer 的实质是一个函数**，根据 `action.type` 来更新 `state` 并返回 `nextState`,最后会用 `reducer` 的返回值 `nextState` 完全替换掉原来的 `state`

> 注意：上面的这个 “更新” 并不是指 `reducer` 可以直接对 `state` 进行修改
> Redux 规定，须先复制一份 `state`，在副本 `nextState` 上进行修改操作
> 例如，可以使用 lodash 的 `cloneDeep`，也可以使用 `Object.assign / map / filter/ ...` 等返回副本的函数

```js
var initState = {
  counter: 0,
  todos: []
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      var nextState = _.cloneDeep(state) // 用到了 lodash 的深克隆
      nextState.todos.push(action.payload) 
      return nextState

    default:
    // 由于 nextState 会把原 state 整个替换掉
    // 若无修改，必须返回原 state（否则就是 undefined）
      return state
  }
}
```

> 通俗点讲，就是 `reducer` 返回啥，`state` 就被替换成啥

# 5.Redux API

> [Redux API 总览](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/redux-advanced-tutorial.md)
>
> [中间件的洋葱模型](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/middleware-onion-model.md)

Redux 有五个 API，分别是：

- `createStore(reducer, [initialState])` 创建store
- `combineReducers(reducers)` 管理多个reducer
- `applyMiddleware(...middlewares)` 管理中间件，如`redux-saga`
- `bindActionCreators(actionCreators, dispatch)`实现自动 `dispatch`
- `compose(...functions)`高阶函数

`createStore` 生成的 `store` 有四个 API，分别是：

- `getState()`
- `dispatch(action)`
- `subscribe(listener)`
- `replaceReducer(nextReducer)`

# 小结

+ `store` 由 Redux 的 `createStore(reducer)` 生成
+ `state` 通过 `store.getState()` 获取，本质上一般是一个存储着整个应用状态的对象
+ `action` 本质上是一个包含 `type` 属性的普通对象，由 `Action Creator` (函数) 产生
+ 改变 `state` 必须 `dispatch` 一个 `action`
+ `reducer` 本质上是根据 `action.type` 来更新 `state` 并返回 `nextState` 的函数
+ `reducer` 必须返回值，否则 `nextState` 即为 `undefined`

实际上，`state` 就是所有 `reducer` 返回值的汇总: `state + action = new state`

> Action Creator => action => store.dispatch(action) => reducer(state, action) => 原 state state = nextState

**Redux 与传统后端 MVC 的对照**

| Redux                             | 传统后端 MVC                                    |
| --------------------------------- | ----------------------------------------------- |
| `store`                           | 数据库实例                                      |
| `state`                           | 数据库中存储的数据                              |
| `dispatch(action)`                | 用户发起请求                                    |
| `action: { type, payload }`       | `type` 表示请求的 URL，`payload` 表示请求的数据 |
| `reducer`                         | 路由 + 控制器（handler）                        |
| `reducer` 中的 `switch-case` 分支 | 路由，根据 `action.type` 路由到对应的控制器     |
| `reducer` 内部对 `state` 的处理   | 控制器对数据库进行增删改操作                    |
| `reducer` 返回 `nextState`        | 将修改后的记录写回数据库                        |



****************************************************************

**以下为后续学习补充**：

# React-Redux,Redux,React三者关系
+ Redux： 首先 Redux 是一个应用状态管理js库，它本身和 React 是没有关系的，换句话说，Redux 可以应用于其他框架构建的前端应用，甚至也可以应用于 Vue 中。

+ React-Redux：React-Redux 是连接 React 应用和 Redux 状态管理的桥梁。React-redux 主要专注两件事，一是如何向 React 应用中注入 redux 中的 Store ，二是如何根据 Store 的改变，把消息派发给应用中需要状态的每一个组件。

+ React：这个就不必多说了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83eaf84d71b04b94b7b7e754a6778cd1~tplv-k3u1fbpfcp-watermark.awebp)

# redux设计思想：

## redux三大原则
+ 1.**单向数据流**：整个 redux ，数据流向都是单向的
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3775935f59d435fa6326dbcef90519e~tplv-k3u1fbpfcp-watermark.awebp)

+ 2.**state 只读**：在 Redux 中不能通过直接改变 state ，来让状态发生变化，如果想要改变 state ，那就必须触发一次 action ，通过 action 执行每个 reducer 。

+ 3.**纯函数执行**：每一个 reducer 都是一个纯函数，里面不要执行任何副作用，返回的值作为新的 state ，state 改变会触发 store 中的 subscribe 。

## 发布订阅思想
redux 可以作为发布订阅模式的一个具体实现。redux 都会创建一个 store ，里面保存了状态信息，改变 store 的方法 dispatch ，以及订阅 store 变化的方法 subscribe 。

## 中间件思想
redux 应用了前端领域为数不多的中间件 compose ，那么 redux 的中间件是用来做什么的？ 答案只有一个： 那就是**强化 dispatch** ， Redux 提供了中间件机制，使用者可以根据需要来强化 dispatch 函数，传统的 dispatch 是不支持异步的，但是可以针对 Redux 做强化，于是有了 redux-thunk，redux-actions 等中间件，包括 dvajs 中，也写了一个 redux 支持 promise 的中间件。

compose实现：
```js
const compose = (...funcs) => {
  return funcs.reduce((f, g) => (x) => f(g(x)));
}
```
funcs 为中间件组成的数组，compose 通过数组的 reduce 方法，实现执行每一个中间件，强化 dispatch 。


## 核心api
### 1.createStore

createStore redux中通过 createStore 可以创建一个 Store ，使用者可以将这个 Store 保存传递给 React 应用，具体怎么传递那就是 React-Redux 做的事了。首先看一下 createStore 的使用：
```js
const Store = createStore(rootReducer,initialState,middleware)
```

+ 参数一 reducers ： redux 的 reducer ，如果有多个那么可以调用 combineReducers 合并。
+ 参数二 initialState ：初始化的 state 。
+ 参数三 middleware ：如果有中间件，那么存放 redux 中间件。

### combineReducers
```js

/* 将 number 和 PersonalInfo 两个reducer合并   */
const rootReducer = combineReducers({ number:numberReducer,info:InfoReducer })
```

正常状态可以会有多个 reducer ，combineReducers 可以合并多个reducer。

### applyMiddleware

```js
const middleware = applyMiddleware(logMiddleware)
```
applyMiddleware 用于注册中间价，支持多个参数，每一个参数都是一个中间件。每次触发 action ，中间件依次执行。

> [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
>
>[Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
>
>[中文官网：redux-saga](https://redux-saga-in-chinese.js.org/)
>
>[简书：Redux-saga](https://www.jianshu.com/p/6f96bdaaea22)

<iframe src="http://cn.redux.js.org/" width="100%" height="666px"></iframe>
[Redux 中文文档](https://cn.redux.js.org/)
