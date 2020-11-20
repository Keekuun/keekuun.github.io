---
title: 【React】React创建组件
date: 2019-11-14
sidebar: auto
categories: 
- 前端
- React
tags: 
- JS
- React
---

## 函数组件

```jsx
import React from 'react';
// 注意：组件名称必须以大写字母开头
function Hello(props) {
    return <h1>Hello,{props.name}!</h1>
}

// 使用
ReactDOM.render(
    <Hello name={"Alan"} />,
    document.getElementById('app')
);
```

组件名，即函数名，接受一个`props`参数，这个参数是一个对象，包含自定义属性，用来给组件传值，例如，通过`{props.name}`就可以获取`name`的值。

React 会将小写字母开头的组件视为原生 DOM 标签，例如：`<div />` 代表 HTML 的 div 标签，而 `<Hello />` 则代表一个组件，并且需要在作用域内使用 `<Hello />`。 

## 类组件

```jsx
import React from 'react';

class Hello extends React.Component { // 需要继承 React.Component 类
    constructor(props) { // 构造方法可以省略
        super(props)
    }
    
    render() { // 必须有render函数，创建React元素
        return <h1>Hello,{this.props.name}!</h1>
    }
}

ReactDOM.render(
    <Hello name={"Alan"} />,
    document.getElementById('app')
);
```

## 组件的props属性

props属性用来动态传值，通过props属性复用组件，让相同的组件呈现不同的内容。

```jsx
const user = {
        name: "Han Solo",
        age: 17,
        gender: 'male'
    };
<Hello name={"张三"} info={{name:"张三", age: 20}}/>
<Hello {...user}/>
```

注意，在使用props动态传值时，要使用插值表达式的形式（即大括号）插入JS表达式，不能直接赋值。

<iframe height="265" style="width: 100%;" scrolling="no" title="React-基本使用" src="https://codepen.io/zkkysqs/embed/NWWXerG?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/zkkysqs/pen/NWWXerG'>React-基本使用</a> by zkkysqs
  (<a href='https://codepen.io/zkkysqs'>@zkkysqs</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

