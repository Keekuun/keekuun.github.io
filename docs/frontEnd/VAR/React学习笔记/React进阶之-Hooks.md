---
title: 【React】React Hooks
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

> [React 架构的演变 - Hooks 的实现](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-hooks-%E7%9A%84%E5%AE%9E%E7%8E%B0/)
>
>[React Hooks 原理 ](https://github.com/brickspert/blog/issues/26)





| 钩子          | 用法                                                  | 作用                                  |
| ------------- | ----------------------------------------------------- | ------------------------------------- |
| `useState`    | `const [state, changeState] = useState(initialValue)` | 用于生成**状态以及改变状态的方法**    |
| `useEffect`   | `useEffect(fn, [...relativeState])`                   | 用于生成**与状态绑定的副作用**        |
| `useCallback` | `useCallback(fn, [...relativeState])`                 | 用于生成**与状态绑定的回调函数**      |
| `useMemo`     | `useMemo(fn, [...relativeState])`                     | 用于生成**与状态绑定的组件/计算结果** |
| `useRef`      | `const newRef = useRef(initialValue)`                 | 用于 获取节点实例 / 数据保存          |

