---
title: 【React】React组件间的通信
date: 2019-11-17
categories: 
- 前端
tags: 
- JS
- React
---



## 父传子

在父组件中初始化数据，将子组件的`props`属性值通过父组件的状态`state`来管理，父组件通过调用`setState`方法来更新子组件数据：

<iframe height="265" style="width: 100%;" scrolling="no" title="React父子组件的通信" src="https://codepen.io/zkkysqs/embed/RwwmJxO?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/zkkysqs/pen/RwwmJxO'>React父子组件的通信</a> by zkkysqs
  (<a href='https://codepen.io/zkkysqs'>@zkkysqs</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 子传父

在子组件中初始化数据，在子组件构造方法中通过`props`调用父组件回调函数设置`setState`，更新父组件的`state`状态，从而更新父组件数据：

<iframe height="265" style="width: 100%;" scrolling="no" title="React 父子之间的通信-子传父" src="https://codepen.io/zkkysqs/embed/ExxzRJp?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/zkkysqs/pen/ExxzRJp'>React 父子之间的通信-子传父</a> by zkkysqs
  (<a href='https://codepen.io/zkkysqs'>@zkkysqs</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 任意组件

任意组件间的通信，若不借助其他库，一般借用消息中间件和状态管理来实现：

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="zkkysqs" data-slug-hash="eYYajNK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React组件间的通信-消息接口">
  <span>See the Pen <a href="https://codepen.io/zkkysqs/pen/eYYajNK">
  React组件间的通信-消息接口</a> by zkkysqs (<a href="https://codepen.io/zkkysqs">@zkkysqs</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
 消息中间件的模式非常简单，利用了观察者模式，将两个组件之间的耦合解耦成了组件和消息中心+消息名称的耦合 ，但为了解耦却引入全局消息中心和消息名称，消息中心对组件的侵入性很强 ，谨慎使用。

## 单向数据流

现在，我们已经知道：

+ 父传子：父组件通过`props`直接赋值的形式实现，更新数据使用`state`管理状态，直接调用`this.setState`方法。
+ 子传父：子组件通过`props`调用父组件的方法，从而间接调用父组件的`this.setState`方法将子组件的数据传给父组件，并更新父组件视图。

 单向数据流是指数据的流向只能由父组件通过`props`将数据传递给子组件，不能由子组件向父组件传递数据，要想实现数据的双向绑定，只能由子组件接收父组件`props`传过来的方法去改变父组件的数据，而不是直接将子组件的数据传递给父组件。

## 更进一步

如果项目非常大，上面方案都不合适，那你可能需要一个状态管理工具，通过状态管理工具把组件之间的关系，和关系的处理逻辑从组建中抽象出来，并集中化到统一的地方来处理，[Redux](https://redux.js.org)就是一个非常不错的状态管理工具。

除了[Redux](https://redux.js.org)，还有[Mobx](https://cn.mobx.js.org)，Rematch，reselect等工具，这些都是用来解决不同问题的，只要根据自己的场景选择合适的工具就好了。