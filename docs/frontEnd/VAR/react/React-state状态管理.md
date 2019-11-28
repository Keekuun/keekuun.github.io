---
title: 【React】React state状态管理
date: 2019-11-15
categories: 
- 前端
tags: 
- JS
- React

---

## state的作用

在创建组件一节，我们知道，函数形式创建的组件是无状态的，类形式创建的组件是有状态的，那么什么是状态呢?

 对于 React 组件，除了接收外部参数 `props`，组件内部也可有不同的状态。 

 State 状态是 React 组件的一个重要概念，它的作用就是**管理当前组件的内部数据**，让 React 组件可以随用户操作、网络响应或者其他变化而动态更改输出内容。 

## class组件-state

 React 规定：组件的内部状态记录在组件的 `this.state` 对象上面。 

- 方法一：为组件添加 `constructor` 构造函数，然后在该函数中为 `this.state` 赋初始值

  ```jsx
  class App extends React.Component {
      constructor(){
          super();
          this.state = { count: 0 }
      }
  
      render(){
          return <button>你点了我 {this.state.count} 次</button>
      }
  }
  ```

- 方法二：使用 class 属性新提案(推荐)

  ```jsx
  class App extends React.Component {
      state = { count: 0 }
  
      render(){
          return <button>你点了我 {this.state.count} 次</button>
      }
  }
  ```

## 使用state管理props数据

React组件是不能修改props数据的，如果想在组建内部修改props数据，可以将props挂载到state上

```jsx
class Counter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // 若 props 未传入 count，则赋初始值为 0
            count: this.props.count || 0
        }
    }

    render(){
        return <button>你点了我 {this.state.count} 次</button>
    }
}
```

## 更新数据

 使用 `setState()` 更新组件数据，这样才能实时渲染更新视图：

```jsx
class Counter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            count: this.props.count || 0
        }
    }

    handleClick = () => {
        let {count} = this.state;
        // 使用 setState()
        this.setState({count: ++count})
    }

    render(){
        return <button onClick={this.handleClick}>你点了我 {this.state.count} 次</button>
    }
}
```

> state 状态即组件数据，它是私有的，完全由当前组件来控制。 

## state要点

+ 不要直接修改state，应使用`setState()`，这样才能实时渲染，更新视图
+ state更新是独立的，可以通过`setState()`单独更新某个变量
+ state更新是异步的， React 出于性能考虑，会把多个 `setState()` 调用合并成一个调用，这意味着调用 `setState()` 时，`this.state`（和 `this.props`）并不会被立即更新。 

我们之前的 `Counter` 组件是这样使用 `setState` 的，此代码有时可能会无法更新计数器：

```jsx
handleClick = () => {
    let { count } = this.state;
    this.setState({ count: count })
}
```

为了避免这个问题，可以让 `setState()` 接收一个函数而不是一个对象，这个函数可以用上一个 `state` 作为第一个参数，将此次更新被应用时的 `props` 做为第二个参数：

```jsx
handleClick = () => {
    this.setState((state, props) => {
        return { count: state.count + 1 }
    })    
}
```

##  state 与 props 对比 

`props` 和 `state` 的**共同点**：

1. 都是普通的 JavaScript 对象；
2. 都是用来保存组件信息的；
3. props 与 state 所保存的信息都可控制组件的渲染输出；

`props` 和 `state` 的**不同点**：

- props 是外部传递给组件的，类似于函数的形参；
- state 是在组件内部由组件自己管理的，类似于在一个函数内声明的变量；

## 有状态组件 与 无状态组件

- **无状态组件：**函数式

```jsx
function Welcome (props) {
    return <h1>{ props.name }~ 你好呀！</h1>
}
```

- **有状态组件：**class式

```jsx
class Welcome extends React.Component {
    state = { name : "Alan" }

    render(){
        return <div>Hello，{this.state.name}</div>
    }
}
```

>  在 16.8 版本之前，函数式组件一定是无状态组件，而 16.8 版本开始 React 提出了新的 Hook，可以让你在不编写 class 的情况下使用 state 以及其它的 React 特性。 