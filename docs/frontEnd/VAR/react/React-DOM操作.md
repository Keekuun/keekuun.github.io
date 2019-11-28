

---
title: 【React】React-DOM操作
date: 2019-11-13
categories: 
- 前端
tags: 
- JS
- React

---

# React DOM操作

React应用大部分情况下是不需要通过查询DOM元素去更新组件的UI的，只需要关注、设置组件的状态即可，但有时也需要直接操作DOM。

React应用中操作DOM方式：

1. 通过事件对象获取 DOM；
2. React 的特殊属性`refs`；
3. ReactDOM 提供的方法：`findDOMNode`；

## 事件对象获取 DOM

在 React 的事件系统中，你可以通过访问事件对象的`currentTarget`与`target`属性来获取相关的 DOM 元素：

`event.currentTarget`：返回绑定事件处理器的 DOM 元素的引用；

`event.target`：返回触发事件处理函数的 DOM 元素的引用；

```jsx
class BtnGroup extends React.Component {
    handleClick = (e) => {
        if (e.target.tagName !== "BUTTON") return;
        e.currentTarget.style.backgroundColor = "skyblue";
        e.target.innerText = "你点到我了";
        console.log(e.nativeEvent); // 原生事件
    }

    render() {
        return (
            <div className="btn-group" onClick={this.handleClick}>
                <button>按钮1</button>
                <button>按钮2</button>
                <button>按钮3</button>
            </div>  
        )
    }
}
```

>  也可以通过`event.nativeEvent`属性访问到浏览器的底层事件，利用熟悉的原生事件对象获取相关的 DOM 元素。 

## React 的特殊属性`refs`

>  Refs 提供了一种方式，允许我们访问 DOM 节点、或者是在 render 方法中创建的 React 元素。 

### 创建 Refs

 Refs 是使用`React.createRef()`创建的，并通过`ref`属性附加到 React 元素上。在构造组件时，通常将 Refs 分配给**实例属性**，以便可以在整个组件中引用它们： 

```jsx
class App extends React.Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef(); // 创建 Refs
    }

    render() {
        return (
            <div className="btn-group" ref={this.myRef}> // 绑定ref
                <button>戳我</button>
            </div>
        )
    }
}
```

### 访问Refs

 当`ref`被传递给`render`中的元素时，对该节点的引用可以通过 ref 的`current`属性访问： 

```jsx
class BtnGroup extends React.Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef();
    }

    handleClick = () => {
        const wrapEle = this.myRef.current;
        wrapEle.style.backgroundColor = "skyblue";
    }

    render() {
        return (
            <div className="btn-group" ref={this.myRef}>
                <button onClick={this.handleClick}>戳我</button>
            </div>  
        )
    }
}
```

 `ref`属性也可以附加到 React 组件上，需要注意的是根据节点类型的不同 `ref` 的值也有差异： 

- 当 ref 属性用于 HTML 元素时，ref 对象接收**底层 DOM 元素**作为其 current 属性；
- 当 ref 属性用于自定义 class 组件时，ref 对象接收**组件的挂载实例**作为其 current 属性；

**注意：**你**不能**在函数组件上用 ref 属性，因为他们没有实例。

```jsx
class App extends React.Component {
    constructor(props) {
        super(props);
        this.btnGroup = React.createRef();
    }

    handleClick = () => {
        // 返回子组件实例
        const btnGroup = this.btnGroup.current;

        // 强行触发子组件的点击事件
        btnGroup.handleClick();
    }

    render() {
        return (
            <div>
                <BtnGroup ref={this.btnGroup} />
                <button onClick={this.handleClick} >点我可以通过 ref 属性访问子组件实例</button>
            </div>
        )
    }
}
```

## findDOMNode方式

 如果 React 组件已经被渲染，使用`ReactDOM.findDOMNode()`可访问浏览器中相应的原生 DOM 元素，此方法对于从 DOM 中读取值很有用。 

```jsx
class App extends React.Component {
    handleClick = () => {
        // 返回浏览器中与 App 组件相对应的 DOM 元素
        const appDOM = ReactDOM.findDOMNode(this);
        appDOM.style.backgroundColor = "skyblue";
    }

    render() {
        return (
            <div>
                <BtnGroup />
                <button onClick={this.handleClick}>点我下试试</button> 
            </div>
        )
    }
}
```

`ReactDOM.findDOMNode()`方法的注意事项：

1. 当组件渲染的内容为 null 或 false 时，此 API 也会返回 null；
2. 此 API 不能用于函数组件；
3. React 推荐将此 API 作为访问底层 DOM 节点的应急方案，优先考虑 Refs。

