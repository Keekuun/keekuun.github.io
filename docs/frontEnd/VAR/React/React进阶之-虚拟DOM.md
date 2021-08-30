---
title: 【React】React 虚拟DOM
date: 2020-11-18
sidebar: auto
categories: 
- React
- 前端
tags:
- JS
- React
---

# React 虚拟DOM

> [虚拟 DOM 到底是什么？](https://blog.shenfq.com/2019/%E8%99%9A%E6%8B%9F-dom-%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F/)


虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 tag、props、children 三个属性。

```html
<table class="table">
    <tr>
        <td>1</td>
        <td>1</td>
    </tr>
    <tr>
        <td>1</td>
    </tr>
</table>
```
上面的 HTML 转换为虚拟 DOM 如下：
```
const VDOMRoot = {
  type: 'table',
  props: { className: 'table' },
  children: [
    {
      type: 'tr',
      props: { },
      children: [
        {
          type: 'td',
          props: { },
          children: [{type: 'text', value: '1'}]
        },
        {
          type: 'td',
          props: { },
          children: [{type: 'text', value: '1'}]
        }
      ]
    },
    {
      type: 'tr',
      props: { },
      children: [
        {
          type: 'td',
          props: { },
          children: [{type: 'text', value: '1'}]
        }
      ]
    }
  ]
}
```

先来看看fiber node:
```js
function FiberNode (tag, key) {
  // 节点 key，主要用于了优化列表 diff
  this.key = key
  // 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...
  this.tag = tag

  // 子节点
  this.child = null
  // 父节点
  this.return = null 
  // 兄弟节点
  this.sibling = null
  
  // 更新队列，用于暂存 setState 的值
  this.updateQueue = null
  
  // 节点更新过期时间，用于时间分片
  // react 17 改为：lanes、childLanes
  this.expirationTime = NoLanes
  this.childExpirationTime = NoLanes

  // 对应到页面的真实 DOM 节点
  this.stateNode = null
  // Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能
  this.alternate = null
}
```

上述dom转为fiber node: 
```js
// 有所简化，并非与 React 真实的 Fiber 结构一致
const FiberRoot = {
  type: 'table',
  return: null,
  sibling: null,
  child: {
    type: 'tr',
    return: FiberNode, // table 的 FiberNode
    sibling: {
      type: 'tr',
      return: FiberNode, // table 的 FiberNode
      sibling: null,
      child: {
        type: 'td',
        return: FiberNode, // tr 的 FiberNode
        sibling: {
          type: 'td',
          return: FiberNode, // tr 的 FiberNode
          sibling: null,
          child: null,
          text: '1' // 子节点仅有文本节点
        },
        child: null,
        text: '1' // 子节点仅有文本节点
      }
    },
    child: {
      type: 'td',
      return: FiberNode, // tr 的 FiberNode
      sibling: null,
      child: null,
      text: '1' // 子节点仅有文本节点
    }
  }
}
```
![](https://file.shenfq.com/pic/20200929103938.png)

> [React 架构的演变 - 从递归到循环](https://blog.shenfq.com/posts/2020/React%20%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98%20-%20%E4%BB%8E%E9%80%92%E5%BD%92%E5%88%B0%E5%BE%AA%E7%8E%AF.html)

> [虚拟DOM到底是什么？](https://blog.shenfq.com/posts/2019/%E8%99%9A%E6%8B%9FDOM%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F.html)
