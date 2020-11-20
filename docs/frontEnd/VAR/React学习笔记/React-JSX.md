---
title: 【React】React-JSX
date: 2019-11-12
sidebar: auto
categories: 
- 前端
- React
tags: 
- JS
- React
---

## 认识JSX

**JSX = JS + XML**：JSX就是Javascript和XML结合的一种格式。React发明了JSX，可以方便的利用HTML语法来创建虚拟DOM，当遇到`<`，JSX就当作HTML解析，遇到`{`就当JavaScript解析.

```jsx
const div = (<div> React JXS <div>);
const dom = (
          <div>
              <h1>Hello World!</h1>
              <h2>Now Time {new Date().toLocaleTimeString()}.</h2>
          </div>
          );
```

## JSX特点

1. 通过编译成普通JS运行在JS环境中。
2. 使用XML标签式语法定义JS变量的值。
3. 在标签内使用`{}`包裹，写JS表达式。

```jsx
import React from 'react'
const Component = React.Component
class App extends Component{
    render(){
        return ( {/*必须使用()包裹*/}
                {/*在<>中写HTML*/}
            <ul className="my-list">
        		{/*在{}中写JS代码*/}
                <li>{false?'hello':'hi'}</li>
                <li>I love React</li>
            </ul>
        )
    }
}
export default App;
```

## JSX {JS表达式}

JSX中`{}`内部的JS表达式：

| JS表达式类型  | JSX代码块                                        | 测试结果  |
| ------------- | ------------------------------------------------ | --------- |
| string/number | `<div> {'hello'}{111} <div>`                     | hello 111 |
| array         | `<div>{[1,2,3]}</div>`                           | 123       |
| true/false    | `<div>{true}{false}</div>`                       | 不显示    |
| object        | `object = {width:"20px"}` `<div style={object}>` |           |
| =、+、-、*、/ | `<div>{a=1}{a=a+2}{a=a-1}{a=a*6}{a/2}<div>`      | 132126    |
| ？a:b         | `<p>{a=0}{a>1?'haha':'hehe'}</p>`                | 0hehe     |
| function      | `<p>{alert(111)}</p>`                            | 弹出框    |

+ **允许：`number`、`string`、`Array`、`React`元素，其中`Array`会被扁平化，数组的每一项都将作为子节点渲染** 
+ **不允许：普通的 `JavaScript`对象、`function`函数**
+ **无渲染：`null`、`undefined`、`boolean`、`symbol`**

## JSX注意事项

### JSX创建DOM规范

+ **首字母小写的字符串是HTML标签**

  ```jsx
  ReactDOM.render(
      <div className="foo" />,
      document.getElementById("app")
  );
  ```

+ **首字母大写的变量是React组件**

```jsx
function MyComponent() {
    return (
        <div>
            <h1>我的组件</h1>
            <p>一个无属性、无状态、最简单的组件</p>
        </div>
    );
}

// 渲染一个 MyComponent 组件到页面的 "#app" 容器中
ReactDOM.render(
    <MyComponent />,
    document.getElementById("app")
);
```

### JSX声明React元素规范

+ **必须有且只有一个React元素根节点**

  ```jsx
  // 反例
  const ele1 = (
      <h1>没有一个根标签包裹</h1>
      <p>与 h1 标签同级</p>
  );
  // 正确
  const ele2 = (
      <div>
        <h1>没有一个根标签包裹</h1>
        <p>与 h1 标签同级</p>
      </div>
  );
  ```

   作`Flex`布局的时候,外层不能有包裹元素 ， 在React16 之后，我们可以使用`<Fragment>`标签替代，在渲染时就没有最外层的包裹标签：

  ```jsx
  import React,{Component,Fragment } from 'react'
  class Test extends Component{
      render(){
          return  (
              <Fragment>
                  <h1>Fragment标签</h1>
                  <p>使用Fragment来代替根节点，去除最外层包裹，便于flex布局</p>
              </Fragment>
          )
      }
  }
  ```


+ **JSX中所有的标签都必须正确闭合**

  ```jsx
  // 反例
  const ele = <input type="text">;
  // 正确
  const ele = <input type="text"/>;
  const ele = <div />
  ```

+ **标签嵌套规则需要符合 W3C 标准，否则会给出相应警告**

  +  低级标题里不允许嵌套高级标题 

  +  在 p 标签里不允许嵌套块级元素 

    ```jsx
    // 反例
    ReactDOM.render( 
        <div>
            <h2>                
                <h1>h1 的级别比 h2 高</h1>            
            </h2> 
            
            <p>
            	<div>在 p 标签里嵌套了块级元素</div>
            </p>
        </div>,
        document.getElementById("app")        
    );
    ```

### JSX标签属性规范

+  所有的属性都是**小驼峰命名**的 
+  `class` 属性 改为 `className` 
+  `for` 属性 改为 `htmlFor` 
+  `colspan` 属性 改为 `colSpan` 
+  **在表单元素上：**存在 `value` 与 `defaultValue`、`checked` 与 `defaultChecked`，它们有不同的意义 

```jsx
// import classes form './myCss.css'
{/*JSX 中的注释方式*/}

{/*style属性必须使用 {{}} */}
<div style={{width: "20px", height: "30px"}}>
    { props.text }
</div>

{/*html class属性*/}
<div className="myClass"></div>

{/*html input标签, JSX中所有的标签都必须有闭标签*/}
<input type="text" />

{/*html label标签 */}
<label htmlFor="name" class="mayName"></label>

{/*调用.css 文件中的css属性, mycss 为css文件中的类*/}
<div className={classes['mycss']}></div>
```

 注意：**当 JSX 代码出现换行时，建议使用一对小括号 () 将代码包裹起来，可以防止分号自动插入的 Bug** 

```jsx
const ele = (
    <div>
        使用 () 包裹了 div 标签
    </div>
);
```

 **注意：使用 {} 计算属性值时，会对表达式的返回值调用 `toString` 方法再赋值。** 

## JSX本质

本质上，JSX是`React.createElement`的语法糖，是申明react元素的更高效的方式，不仅允许在JS中编写DOM结构，还可以在DOM节点中插入js表达式，从而更简单、更快速的实现数据绑定。

 **JSX 的本质 API：`React.createElement`** 

```js
/**
* JSX本质API:
* 创建 React 元素
* @param component:组件名，字符串表示的HTML元素或变量名表示的 React.Component 子类
* @param props:组件的属性对象
* @param children:组件的子节点
* */
React.createElement(component, props, ...children);
```

<iframe height="265" style="width: 100%;" scrolling="no" title="React-JSX本质" src="https://codepen.io/zkkysqs/embed/QWWazXM?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/zkkysqs/pen/QWWazXM'>React-JSX本质</a> by zkkysqs
  (<a href='https://codepen.io/zkkysqs'>@zkkysqs</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## JSX的优势

+ 使用有好的HTML式标签方式创建React元素，更加简单快捷，结构清晰，代码可读性强

+ JSX被编译时进行了优化，执行速度更快

+ JSX是类型安全的，在编译过程中就能发现错误

+ JSX在不同的平台提供不同的编译器，可以跨平台（React Native）

  

