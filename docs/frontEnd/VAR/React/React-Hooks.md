---
title: React Hooks
date: 2020-10-17
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---

# React Hooks

| 钩子          | 用法                                                  | 作用                                  |
| ------------- | ----------------------------------------------------- | ------------------------------------- |
| `useState`    | `const [state, changeState] = useState(initialValue)` | 用于生成**状态以及改变状态的方法**    |
| `useEffect`   | `useEffect(fn, [...relativeState])`                   | 用于生成**与状态绑定的副作用**        |
| `useCallback` | `useCallback(fn, [...relativeState])`                 | 用于生成**与状态绑定的回调函数**      |
| `useMemo`     | `useMemo(fn, [...relativeState])`                     | 用于生成**与状态绑定的组件/计算结果** |
| `useRef`      | `const newRef = useRef(initialValue)`                 | 用于 获取节点实例 / 数据保存          |


> [React 架构的演变 - Hooks 的实现](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-hooks-%E7%9A%84%E5%AE%9E%E7%8E%B0/)
>
>[React Hooks 原理 ](https://github.com/brickspert/blog/issues/26)
> 
> [搞懂 useState 和 useEffect 的实现原理](https://zhuanlan.zhihu.com/p/608959809)

## Hooks 出现本质
+ 1 让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。
+ 2 解决逻辑复用难的问题。
+ 3 放弃面向对象编程，拥抱函数式编程。

## hooks与fiber（workInProgress）
类组件的状态比如 state ，context ，props 本质上是存在类组件对应的 fiber 上，包括生命周期比如 componentDidMount ，也是以副作用 effect 形式存在的。那么 Hooks 既然赋予了函数组件如上功能，所以 hooks 本质是离不开函数组件对应的 fiber 的。 hooks 可以作为函数组件本身和函数组件对应的 fiber 之间的沟通桥梁。

hooks 对象本质上是主要以三种处理策略存在 React 中：

+ 1 `ContextOnlyDispatcher`： 第一种形态是防止开发者在函数组件外部调用 hooks ，所以第一种就是报错形态，只要开发者调用了这个形态下的 hooks ，就会抛出异常。
+ 2 `HooksDispatcherOnMount`： 第二种形态是函数组件初始化 mount ，因为之前讲过 hooks 是函数组件和对应 fiber 桥梁，这个时候的 hooks 作用就是建立这个桥梁，初次建立其 hooks 与 fiber 之间的关系。
+ 3 `HooksDispatcherOnUpdate`：第三种形态是函数组件的更新，既然与 fiber 之间的桥已经建好了，那么组件再更新，就需要 hooks 去获取或者更新维护状态。

一个 hooks 对象应该长成这样：

```js
const HooksDispatcherOnMount = { /* 函数组件初始化用的 hooks */
    useState: mountState,
    useEffect: mountEffect,
    ...
}
const  HooksDispatcherOnUpdate ={/* 函数组件更新用的 hooks */
    useState:updateState,
    useEffect: updateEffect,
    ...
}
const ContextOnlyDispatcher = {  /* 当hooks不是函数内部调用的时候，调用这个hooks对象下的hooks，所以报错。 */
    useEffect: throwInvalidHookError,
    useState: throwInvalidHookError,
    ...
}
```

