---
title: 【React】React事件监听
date: 2019-11-16
categories: 
- 前端
tags: 
- JS
- React
---

## 传统DOM事件监听

```html
<button onclick="handleClick()">点我一下试试</button>
```

## react DOM事件监听

```jsx
function handleClick(){
    alert("你敢点我？");
}

// 1.使用 onClick 代替 onclick
// 2.使用 {handleClick} 传入一个函数，而非字符串
ReactDOM.render(
    <button onClick={handleClick}>点我一下试试</button>,
    document.getElementById("app")
)
```

- React 事件的命名采用**小驼峰式**（camelCase），而不是纯小写；
- 使用 JSX 语法时，需要传入一个**函数**作为事件处理函数，而不是一个字符串。

## class 组件中的事件处理函数

+ 在`constructor`中将事件处理函数定义为组件实例的私有方法：

```jsx
class App extends React.Component {
    constructor() {
        super();
        // 箭头函数
        this.handleClick = () => { alert("试试就试试"); }
    }
    
    render() {
        return <button onClick={this.handleClick}>点我一下试试</button>
    }
}
```

+  使用 class 属性定义事件处理函数，与方法一的作用相同，会成为组件实例的私有方法 ：

```jsx
class App extends React.Component {
    constructor(){
        super();
        // 在 constructor 函数中绑定 this
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick = function() { alert("试试就试试"); }

    render(){
        return <button onClick={this.handleClick}>点我一下试试</button>
    }
}
```

+  将事件处理函数定义为组件的公有方法 ：

```jsx
class App extends React.Component {
    // 注意与方法二的区别
    handleClick() { alert("试试就试试"); }

    render(){
        // 在 render 函数中绑定 this
        return <button onClick={this.handleClick.bind(this)}>点我一下试试</button>
    }
}
```

**由于箭头函数中的 this 会指向父级上下文，而无需我们手动绑定，简洁有效，推荐！** 

+  向事件处理程序传递参数 

  ```jsx
  // 使用 bind 预传参
  <button onClick={this.handleClick.bind(this, id)}>点我呀</button>
  
  // 在箭头函数外部嵌套一层函数
  <button onClick={(e) => this.handleClick(id, e)}>点我呀</button>
  ```

## React 的事件对象

### 合成事件对象`SyntheticEvent`

为了解决跨浏览器兼容性问题，React 将浏览器的原生事件封装为合成事件`SyntheticEvent`，并将它的实例作为事件对象（示例中的`e`）传入设置的事件处理程序。

`SyntheticEvent`是 React 根据 W3C 规范来定义的，是跨浏览器事件的包装器，与原生事件具有相同的接口。

### 阻止默认行为 

 在 React 中，不能通过返回 `false` 的方式阻止默认行为，必须显式的使用 `preventDefault`。 

 传统的 HTML 中阻止链接默认打开一个新页面 :

```jsx
<a href="https://www.w3cschool.cn/" onclick="return false">w3cschool</a>
```

 在 React 中 :

```jsx
class App extends React.Component {
    handleClick = (e) => { e.preventDefault() }
    
    render() {
        return <a href="https://www.w3cschool.cn/" onClick={this.handleClick}>w3cschool</a>            
    }
}
```

