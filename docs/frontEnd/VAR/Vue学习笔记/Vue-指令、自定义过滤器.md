---
title: 【Vue】Vue-指令、自定义过滤器
sidebar: auto
date: 2019-7-14
isComment: true
categories: 
- 前端
- Vue
tags: 
- JS
- Vue
---

## 一. Vue简介
> [Vue2.x中文官方文档](http://doc.vue-js.com/v2/guide/)

## 1. Vue.js初识
> Vue.js（读音 /vjuː/, 类似于 view） 是一套构建用户界面的**`渐进式框架`**。与其他重量级框架不同的是，Vue 采用**自底向上增量开发**的设计。Vue 的核心库只关注视图层，并且非常容易学习，非常容易与其它库或已有项目整合。另一方面，Vue 完全有能力驱动采用单文件组件和Vue生态系统支持的库开发的复杂单页应用。
  Vue.js 的目标是**`通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件`**。

> 知乎解释：[Vue2.0 中，“渐进式框架”和“自底向上增量开发的设计”这两个概念是什么？](https://www.zhihu.com/question/51907207)

##  2.Vue起步

### 1. 安装
+ 下载核心库文件
```shell
bower info vue
npm init --yes
cnpm install vue --save
```
+ 像Jquery一样引入到你的html文档中
```js
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="./node_modules/vue/dist/vue.min.js"></script>
```
> 这里将Vuejs当做一个js库来使用，也可以使用`vue-cli`,后续会用到。

### 2. 安装调试工具vue-devtools插件

安装调试工具vue-devtools插件，便于在浏览器中调试vue

### 3.牛刀小试
```vue
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>初识Vue</title>
	<script src="https://unpkg.com/vue/dist/vue.js"></script>
	<!--<script src="./node_modules/vue/dist/vue.min.js"></script>-->
	
	<script>
		window.onload = () => {
        const app = new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!'
            }
        })
		}
	</script>
</head>
<body>
<div id="app">
	{{ message }}
</div>
</body>
</html>
```

### 4.vue核心基础知识
### 1. 模板语法
    {{data}}, 即Mustache语法
### 2. 指令
指令:用来扩展html标签的功能

    angularjs中常用的指令：
        ng-model
        ng-repeat
        ng-click
        ng-show/ng-hide
        ng-if
        
    angularTs中常用的指令：
        ([ngModel])
         *ngIf
         *ngFor
         [ngClass]
         [ngSwitch]
         [ngStyle]
         
    vuejs中常用的指令:
        v-model
        v-if
        v-for
        v-on
        v-show
        v-bind
        v-once
     
vuejs中常用的指令介绍
    
+ v-model
    + 类型： 随表单控件类型不同而不同。
    + 限制：
        - `<input>`
        - `<select>`
        - `<textarea>`
        - `components`
    + 修饰符：
        - `.lazy` - 取代 input 监听 change 事件
        - `.number` - 输入字符串转为数字
        - `.trim` - 输入首尾空格过滤
        
    在表单控件或者组件上创建双向绑定。
    
    ```vue
    <input type="text" class="form-control" id="email" v-model="user.email" placeholder="请输入邮箱">
    ```
+ v-for
    + 类型： Array | Object | number | string
    
    基于源数据多次渲染元素或模板块。此指令之值，必须使用特定语法 alias in expression ，为当前遍历的元素提供别名：
    ```vue
    <div v-for="item in items">
      {{ item.text }}
    </div>
  
    <!--也可以用for of-->
    <div v-for="item of items">{{ item.text }}</div>
    
     <!--value 和 key 与 index-->
    <div v-for="(item, index) in items"></div>
    <div v-for="(val, key) in objects"></div>
    <div v-for="(val, key, index) in objects"></div>
    
    <!--整数迭代，结果：1 2 3 4 5 6 7 8 9 10-->
    <div>
      <span v-for="n in 10">{{ n }}</span>
    </div>
  
    <!--提供一个 key 的特殊属性：key的作用主要是为了高效的更新虚拟DOM-->
    <div v-for="item in items" :key="item.id">
      {{ item.text }}
    </div>
    ```
> v-for中`:key`的作用主要是为了高效的更新虚拟DOM
> [Vue2.0 v-for 中 :key 到底有什么用？](https://www.cnblogs.com/zhumingzhenhao/p/7688336.html)

+ v-on 

    用来绑定事件，用法：v-on:事件="函数"，缩写：@
     如：v-on:click=""，简写方式 @click="" 
      
    修饰符：
    - `.stop` - 调用 `event.stopPropagation()`。
    - `.prevent` - 调用 `event.preventDefault()`。
    - `.capture` - 添加事件侦听器时使用 `capture` 模式。
    - `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
    - `.{keyCode | keyAlias}` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
    - `.native` - 监听组件根元素的原生事件。
    
    用在普通元素上时，只能监听 `原生 DOM 事件`。用在自定义元素组件上时，也可以监听子组件触发的`自定义事件`。
    
    在监听原生 DOM 事件时，方法以事件为唯一的参数。如果使用内联语句，语句可以访问一个 `$event` 属性： `v-on:click="handle('ok', $event)"`。
    
    ```vue
    <!-- 方法处理器 -->
    <button v-on:click="doThis"></button>
    <!-- 内联语句 -->
    <button v-on:click="doThat('hello', $event)"></button>
    <!-- 缩写 -->
    <button @click="doThis"></button>
    <!-- 停止冒泡 -->
    <button @click.stop="doThis"></button>
    <!-- 阻止默认行为 -->
    <button @click.prevent="doThis"></button>
    <!-- 阻止默认行为，没有表达式 -->
    <form @submit.prevent></form>
    <!--  串联修饰符 -->
    <button @click.stop.prevent="doThis"></button>
    <!-- 键修饰符，键别名 -->
    <input @keyup.enter="onEnter">
    <!-- 键修饰符，键代码 -->
    <input @keyup.13="onEnter">
    ```
    
    在子组件上监听自定义事件（当子组件触发 “my-event” 时将调用事件处理器）：
    ```vue
    <my-component @my-event="handleThis"></my-component>
    <!-- 内联语句 -->
    <my-component @my-event="handleThis(123, $event)"></my-component>
    <!-- 组件中的原生事件 -->
    <my-component @click.native="onClick"></my-component>
    ```
+ v-show
    + 类型： any
    
    用来显示或隐藏元素，v-show是通过display实现，v-if是每次删除后再重新创建，与angularjs中类似 
    ```vue
    <div v-show="flag">如果flag=false我就不显示（display:none）</div>
    ```
+ v-if
    + 类型： any
    
    根据表达式的值的真假条件渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 <template> ，将提出它的内容作为条件块。
    当条件变化时该指令触发过渡效果。（删除重绘）
    ```vue
    <div v-if="flag">如果flag=true我就显示（删除重绘）</div>
    ```
+ v-else
    前一兄弟元素必须有 v-if。
    ```vue
    <div v-if="Math.random() > 0.5">
      Now you see me
    </div>
    <div v-else>
      Now you don't
    </div>
    ```
+ v-bind 
    + 缩写： `:`
    + 类型： any (with argument) | Object (without argument)
    + 修饰符：
    `.prop` - 被用于绑定 DOM 属性。
    
    动态地绑定一个或多个特性，或一个组件 prop 到表达式。
    
    在绑定 `class` 或 `style` 特性时，支持其它类型的值，如数组或对象。
    
    在绑定 `prop` 时，`prop` 必须在**子组件**中声明。可以用修饰符指定不同的绑定类型。
    
    没有参数时，可以绑定到一个包含键值对的对象。注意此时 class 和 style 绑定不支持数组和对象。
    
    ```vue
    <!-- 绑定一个属性 -->
    <img v-bind:src="imageSrc">
    <!-- 缩写 -->
    <img :src="imageSrc">
  
    <!-- class 绑定 -->
    <div :class="{ red: isRed }"></div>
    <div :class="[classA, classB]"></div>
    <div :class="[classA, { classB: isB, classC: isC }]">
  
    <!-- style 绑定 -->
    <div :style="{ fontSize: size + 'px' }"></div>
    <div :style="[styleObjectA, styleObjectB]"></div>
  
    <!-- 绑定一个有属性的对象 -->
    <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>
    
    <!-- 通过 prop 修饰符绑定 DOM 属性 -->
    <div v-bind:text-content.prop="text"></div>
  
    <!-- prop 绑定. “prop” 必须在 my-component 中声明。 -->
    <my-component :prop="someThing"></my-component>
  
    <!-- XLink -->
    <svg><a :xlink:special="foo"></a></svg>
    ```
+ v-text
    + 类型： string
    
    更新元素的 textContent。如果要更新部分的 textContent ，需要使用 {{ Mustache }} 插值。（相当于模板语法{{}}）
    ```vue
    <span v-text="msg"></span>
    <!-- 和下面的一样 -->
    <span>{{msg}}</span>
    ```
+ v-html
    + 类型： string
    
    更新元素的 `innerHTML` 。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译 。如果试图使用 v-html 组合模板,可以重新考虑通过是否通过使用组件来替代。           
    ```vue
    <div v-html="html"></div>
    ```

+ v-pre

    跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。
    ```vue
    <span v-pre>{{ this will not be compiled }}</span>
    ```

+ v-cloak

    这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。
    
    ```vue
     [v-cloak] {
       display: none;
     }
   
    <!--不会显示，直到编译结束。-->
     <div v-cloak>
       {{ message }}
     </div>
    ```
    
+ v-once

    只渲染元素和组件一次。随后的重新渲染,元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。
    ```vue
    <!-- 单个元素 -->
    <span v-once>This will never change: {{msg}}</span>
    <!-- 有子元素 -->
    <div v-once>
      <h1>comment</h1>
      <p>{{msg}}</p>
    </div>
    <!-- 组件 -->
    <my-component v-once :comment="msg"></my-component>
    <!-- v-for 指令-->
    <ul>
      <li v-for="i in list" v-once>{{i}}</li>
    </ul>
    ```
### 3. 过滤器
用来过滤模型数据，在显示之前进行数据处理和筛选
语法：`{{ data | filter1(参数) | filter2(参数)}}`

由于vue2.x中已经没有内置过滤器，所以我们需要自定义过滤器。

#### 自定义全局过滤器
使用全局方法Vue.filter(过滤器ID,过滤器函数)
```vue
Vue.filters('lowercase', function(value){
          // 处理value值,比如：转为小写
          return value.toLowerCase()；
        })
Vue.filter('date',data => {
			let d=new Date(data);
			return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		});
		
// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter');
```

#### 自定义局部过滤器
局部过滤器,如果和全局过滤器名称相同，会覆盖掉全局过滤器。
```vue
let vm=new Vue({
    el:'#app',
    data:{
        currentTime:Date.now()
    },
    filters:{ //局部过滤器
        number:(data,n) => {
            return data.toFixed(n);
        }，
        date: data => {
            let d=new Date(data);
            return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        }
});
```
> 练习：[英雄列表管理](https://codepen.io/keekuun/pen/Wqqoab?editors=1010)

![英雄列表](https://upload-images.jianshu.io/upload_images/16584865-0812f682e3cb5088.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
