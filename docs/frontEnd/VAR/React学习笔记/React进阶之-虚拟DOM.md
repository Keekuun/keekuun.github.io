---
title: 【React】React 虚拟DOM
date: 2020-11-18
sidebar: auto
categories: 
- 前端
- React
tags: 
- JS
- React
---

# React 虚拟DOM

> [虚拟 DOM 到底是什么？](https://blog.shenfq.com/2019/%E8%99%9A%E6%8B%9F-dom-%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F/)


虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 tag、props、children 三个属性。

```html
<div id="app">
  <p class="text">hello world!!!</p>
</div>
```
上面的 HTML 转换为虚拟 DOM 如下：
```
{
  tag: 'div',
  props: {
    id: 'app'
  },
  chidren: [
    {
      tag: 'p',
      props: {
        className: 'text'
      },
      chidren: [
        'hello world!!!'
      ]
    }
  ]
}
```
